describe('Pharmacy', () => {
    it('Deberia crear un nuevo medicamento', () => {
        cy.visit('http://localhost:4200/session/login');

        // Llenar el formulario
        cy.get('input[name="email"]').type('brayan.quialo@gmail.com'); //Este usuario es de rrhh
        cy.get('input[name="password"]').type('contra123');

        // Enviar el formulario
        cy.get('button[type="submit"]').click();

        // Esperar redirección al dashboard de administrador
        cy.url().should('include', '/pharmacy');

        cy.visit('http://localhost:4200/pharmacy/inventory');

        //Esperar a que se cargue la pagina
        cy.contains('Gestión de Inventario').should('exist');

        //Crear un nuevo medicamento
        cy.get('button[data-cy="create-medicine"]').click();

        //Llenar el formulario
        cy.contains("Nuevo Medicamento").should('exist');
        cy.get('input[name="name"]').type('Producto de prueba');
        cy.get('input[name="unitPrice"]').type('100.00');
        cy.get('input[name="unitCost"]').type('60.00');
        cy.get('input[name="stock"]').type('50');
        cy.get('input[name="minStock"]').type('10');

        //Crear el medicamento
        cy.get('button[data-cy="create-medicine-confirm"]').click();

        //Esperar a que se cargue el modal de respuesta
        cy.contains('Medicamento creado correctamente').should('exist');
    });

    it('Deberia comprar un medicamento', () => {
        cy.visit('http://localhost:4200/session/login');

        // Llenar el formulario
        cy.get('input[name="email"]').type('brayan.quialo@gmail.com'); //Este usuario es de rrhh
        cy.get('input[name="password"]').type('contra123');

        // Enviar el formulario
        cy.get('button[type="submit"]').click();

        // Esperar redirección al dashboard de administrador
        cy.url().should('include', '/pharmacy');

        cy.visit('http://localhost:4200/pharmacy/inventory');

        //Esperar a que se cargue la pagina
        cy.contains('Gestión de Inventario').should('exist');

        //Comprar un medicamento
        cy.get('button[data-cy="buy-medicine"]').click();

        //Esperar a que se cargue el modal de respuesta
        cy.contains('Comprar Medicamento').should('exist');

        //Llenar el formulario
        cy.get('input[name="medecine-quantity"]').type('10');

        //Comprar el medicamento
        cy.get('button[data-cy="buy-medicine-confirm"]').click();

        //Esperar a que se cargue el modal de respuesta
        cy.contains('Compra de medicamento exitoso, el stock se ha actualizado').should('exist');
    });

    it('Deberia de realizar una venta de medicamento', () => {
        cy.visit('http://localhost:4200/session/login');

        // Llenar el formulario
        cy.get('input[name="email"]').type('brayan.quialo@gmail.com'); //Este usuario es de rrhh
        cy.get('input[name="password"]').type('contra123');

        // Enviar el formulario
        cy.get('button[type="submit"]').click();

        // Esperar redirección al dashboard de administrador
        cy.url().should('include', '/pharmacy');

        cy.visit('http://localhost:4200/pharmacy/sales');

        //Esperar a que se cargue el modal de respuesta
        cy.contains('Detalle de la Venta').should('exist');


        //Realizar una venta de medicamento
        cy.get('tr[data-cy="sell-medicine"]').first().click();

        //Seleccionar el medicamento
        cy.get('tr[data-cy="sell-medicine"]').click();
    
        //Seleccionar el cliente
        cy.get('select[data-cy="patient-select"]').select('1');

        //Registrar la venta
        cy.get('button[data-cy="register-sale"]').click();

        //Esperar a que se cargue el modal de respuesta
        cy.contains('Venta creada con exito').should('exist');
    });
});
