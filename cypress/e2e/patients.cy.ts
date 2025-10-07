describe('Patients', () => {
    it('Deberia crear un nuevo paciente', () => {
        cy.visit('http://localhost:4200/session/login');

        //Llenar el formulario
        cy.get('input[name="email"]').type('nurse@mail.com'); //Este usuario es encargado de pacientes
        cy.get('input[name="password"]').type('contra123');

        //Enviar el formulario
        cy.get('button[type="submit"]').click();

        // Esperar redirección al dashboard de pacientes
        cy.url().should('include', '/patient-management/home');

        //Ir a la pagina de pacientes
        cy.visit('http://localhost:4200/patient-management/patients');

        //Esperar a que se cargue la pagina
        cy.contains('Lista de Pacientes').should('exist');

        //Crear un nuevo paciente
        cy.get('button[data-cy="add-patient"]').click();

        //Esperar a que se cargue el modal
        cy.contains('Crear Paciente').should('exist');

        //Llenar el formulario
        cy.get('input[name="fullName"]').type('Samuel Gomez');
        cy.get('input[name="cui"]').type('8888888888889');
        cy.get('input[name="birthDate"]').type('1990-05-15')
        cy.get('input[name="phone"]').type('55551234');
        cy.get('input[name="email"]').type('patient@example.com');

        cy.contains('button', 'Crear Paciente').click();

        //Esperar a que se muestre el mensaje de éxito
        cy.contains('Paciente creado exitosamente').should('exist');
    });

    it('Deberia editar un paciente', () => {
        cy.visit('http://localhost:4200/session/login');

        //Llenar el formulario
        cy.get('input[name="email"]').type('nurse@mail.com'); //Este usuario es encargado de pacientes
        cy.get('input[name="password"]').type('contra123');

        //Enviar el formulario
        cy.get('button[type="submit"]').click();

        // Esperar redirección al dashboard de pacientes
        cy.url().should('include', '/patient-management/home');

        //Ir a la pagina de pacientes
        cy.visit('http://localhost:4200/patient-management/patients');

        //Esperar a que se cargue la pagina
        cy.contains('Lista de Pacientes').should('exist');

        //Editar un paciente
        cy.get('button[data-cy="edit-patient"]').first().click();

        //Esperar a que se cargue el modal
        cy.contains('Editar revista').should('exist');

        //Llenar el formulario
        cy.get('input[formControlName="fullName"]').clear().type('Julian Pérez')
        cy.get('input[formControlName="birthDate"]').clear().type('1990-05-10')
        cy.get('input[formControlName="phone"]').clear().type('55551234')
        cy.get('input[formControlName="email"]').clear().type('juan.perez@example.com')

        // Click al botón "Editar Revista"
        cy.contains('button', 'Editar Revista').click()
    })

    it('Deberia asignar un empleado a un paciente', () => {
        cy.visit('http://localhost:4200/session/login');

        //Llenar el formulario
        cy.get('input[name="email"]').type('nurse@mail.com'); //Este usuario es encargado de pacientes
        cy.get('input[name="password"]').type('contra123');

        //Enviar el formulario
        cy.get('button[type="submit"]').click();

        // Esperar redirección al dashboard de pacientes
        cy.url().should('include', '/patient-management/home');

        //Ir a la pagina de pacientes
        cy.visit('http://localhost:4200/patient-management/patients');

        //Esperar a que se cargue la pagina
        cy.contains('Lista de Pacientes').should('exist');

        //Seleccionar un paciente
        cy.get('a[data-cy="patient-details"]').first().click();

        //Esperar a que se cargue la pagina
        cy.contains('Detalles del Paciente').should('exist');

        //Espera a que se cargue la tabla de hospitalizaciones
        cy.contains('Hospitalizaciones').should('exist');

        //Seleccionar la primera hospitalizacion
        cy.get('button[data-cy="assign-employee"]').click();

        //Esperar a que se cargue el modal
        cy.contains('Asignar Empleados al Ingreso').should('exist');

        //Confirmar la asignacion
        cy.get('button[data-cy="assign-employee-confirm"]').click();

        //Esperar a que se muestre el mensaje de éxito
        cy.contains('Se han asignado los empleados exitosamente').should('exist');
    });

    it('Deberia crear una nueva factura y cerrarla', () => {
        cy.visit('http://localhost:4200/session/login');

        //Llenar el formulario
        cy.get('input[name="email"]').type('nurse@mail.com'); //Este usuario es encargado de pacientes
        cy.get('input[name="password"]').type('contra123');

        //Enviar el formulario
        cy.get('button[type="submit"]').click();

        // Esperar redirección al dashboard de pacientes
        cy.url().should('include', '/patient-management/home');

        //Ir a la pagina de pacientes
        cy.visit('http://localhost:4200/patient-management/patients');

        //Esperar a que se cargue la pagina
        cy.contains('Lista de Pacientes').should('exist');

        //Seleccionar un paciente
        cy.get('a[data-cy="patient-details"]').first().click();

        //Esperar a que se cargue la pagina
        cy.contains('Detalles del Paciente').should('exist');

        //Crear una nueva factura
        cy.get('button[data-cy="create-bill"]').click();

        //Esperar a que se cargue el modal
        cy.contains('Nueva Factura').should('exist');

        //Abrir la factura
        cy.get('button[data-cy="open-bill"]').click();

        //Esperar a que se cargue la pagina
        cy.contains('Se ha registrado la factura exitosamente').should('exist');

        //Cerrar la factura
        cy.get('button[data-cy="close-bill"]').click();

        //Esperar a que se cargue el modal
        cy.contains('Pagar y Cerrar Factura').should('exist');

        //Confirmar la cerradura
        cy.get('button[data-cy="close-bill-confirm"]').click();

        //Esperar a que se muestre el mensaje de éxito
        cy.contains('Se ha cerrado la factura exitosamente').should('exist');
    });

    it('Deberia agendar una nueva cirugia y agregar un concepto', () => {
        cy.visit('http://localhost:4200/session/login');

        //Llenar el formulario
        cy.get('input[name="email"]').type('nurse@mail.com'); //Este usuario es encargado de pacientes
        cy.get('input[name="password"]').type('contra123');

        //Enviar el formulario
        cy.get('button[type="submit"]').click();

        // Esperar redirección al dashboard de pacientes
        cy.url().should('include', '/patient-management/home');

        //Ir a la pagina de pacientes
        cy.visit('http://localhost:4200/patient-management/patients');

        //Esperar a que se cargue la pagina
        cy.contains('Lista de Pacientes').should('exist');

        //Seleccionar un paciente
        cy.get('a[data-cy="patient-details"]').first().click();

        //Esperar a que se cargue la pagina
        cy.contains('Detalles del Paciente').should('exist');

        //Crear una nueva cirugia
        cy.get('button[data-cy="create-surgery"]').click();

        //Esperar a que se cargue el modal
        cy.contains('Agendar Cirugía').should('exist');

        ///Llenar el formulario
        cy.get('input[name="description"]').type('Cirugía de rodilla');

        cy.get('input[name="performedDate"]').type('2024-08-01');

        // Seleccionar una tarifa (selecciona la primera opción válida diferente de la predeterminada)
        cy.get('select[name="tariffId"]').select(1)

        // Hacer clic en el botón para agregar la cirugía
        cy.get('button').contains('Agregar Cirugía').click();

        //Esperar a que se muestre el mensaje de éxito
        cy.contains('Se agendó la cirugía exitosamente').should('exist');
    });

    it('Deberia crear una nueva consulta', () => {
        cy.visit('http://localhost:4200/session/login');

        //Llenar el formulario
        cy.get('input[name="email"]').type('nurse@mail.com'); //Este usuario es encargado de pacientes
        cy.get('input[name="password"]').type('contra123');

        //Enviar el formulario
        cy.get('button[type="submit"]').click();

        // Esperar redirección al dashboard de pacientes
        cy.url().should('include', '/patient-management/home');

        //Ir a la pagina de pacientes
        cy.visit('http://localhost:4200/patient-management/patients');

        //Esperar a que se cargue la pagina
        cy.contains('Lista de Pacientes').should('exist');

        //Seleccionar un paciente
        cy.get('a[data-cy="patient-details"]').first().click();

        //Esperar a que se cargue la pagina
        cy.contains('Detalles del Paciente').should('exist');

        //Crear una nueva consulta
        cy.get('button[data-cy="create-consultation"]').click();

        //Esperar a que se cargue el modal
        cy.contains('Nueva Consulta').should('exist');

        //Llenar el formulario
        cy.get('input[data-cy="concept-consultation"]').type('Consulta de dolor de cabeza');

        //Hacer clic en el botón para agregar la consulta
        cy.get('button[data-cy="add-consultation"]').click();

        //Esperar a que se muestre el mensaje de éxito
        cy.contains('Se ha registrado la consulta exitosamente').should('exist');
        
    });
});
