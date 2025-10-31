import { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";

export type ColumnDefinition<T> = {
  header: string;
  field: keyof T;
};

export type CompanyInfo = {
  companyName: string;
  companyAddress: string;
  companyPhoneNumber: string;
  imageUrl?: string;
};


export async function generateReportPDF<T>(
  columns: ColumnDefinition<T>[],
  data: T[],
  company: CompanyInfo,
  currency: string,
  fecha: Date,
  username:String,
  footerFields?: { label: string, value: number | string, isCurrency?:boolean }[]

) {
  const pdfMake = (await import('pdfmake/build/pdfmake.min.js')).default;
  await import('pdfmake/build/vfs_fonts.js');
  
    const formattedFecha = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(fecha);

  const tableBody = [
    columns.map(col => ({ text: col.header, style: "tableHeader" })),
    ...data.map((row: any) =>
      columns.map((col) => {
        let value = row[col.field];
        if (col.field === 'createdAt' && value) {
          try {
            value = new Intl.DateTimeFormat("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(new Date(value));
          } catch (err) {
            console.warn("Error formateando fecha:", value, err);
          }
        }

        return {
          text: value !== null && value !== undefined ? String(value) : "",
          style: "tableCell",
        };
      })
    ),

    
  ];
  

  const content: any[] = [];

  content.push({
    columns: [
      {
        stack: [
          { text: company.companyName, style: "header" },
          { text: company.companyAddress, style: "subheader" },
          { text: `Tel: ${company.companyPhoneNumber}`, style: "subheader" },
          { text: `Fecha: ${fecha}`, style: "subheader" },
          { text: `Usuario que genero reporte: ${username}`, style: "subheader" },
        ],
        alignment: "right",
      },
    ],
    margin: [0, 0, 0, 10],
  });

  content.push({
    table: {
      headerRows: 1,
      widths: columns.map(() => 'auto'),
      body: tableBody,
    },
    layout: "lightHorizontalLines",
  });

  if (footerFields && footerFields.length > 0) {
    footerFields.forEach(field => {
      const formattedValue = typeof field.value === 'number'
      ? (field.isCurrency ? `${currency} ${field.value.toFixed(2)}` : field.value.toString())
      : field.value;
    
  
      content.push({
        columns: [
          { text: "", width: "*" },
          {
            text: `${field.label}: ${formattedValue}`,
            style: "total",
            alignment: "right",
            margin: [0, 10, 0, 0],
          },
        ],
      });
    });
  }  

  const styles: StyleDictionary = {
    header: {
      fontSize: 16,
      bold: true,
    },
    subheader: {
      fontSize: 10,
      margin: [0, 2, 0, 2],
    },
    tableHeader: {
      bold: true,
      fontSize: 11,
      color: "black",
    },
    total: {
      fontSize: 12,
      bold: true,
    },
  };

  const docDefinition: TDocumentDefinitions = {
    content,
    styles,
    pageOrientation: 'landscape',
  };

  pdfMake.createPdf(docDefinition).open();
  
}

export function getBase64ImageFromUrl(url: string): Promise<string> {
  return fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("No se pudo cargar la imagen");
      return response.blob();
    })
    .then(blob => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob); 
      });
    });
}

  

