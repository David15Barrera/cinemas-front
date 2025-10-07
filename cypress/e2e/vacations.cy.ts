describe('Vacations', () => {

    it('Deberia de rechazar una solicitud de vacaciones, crear otra y aprobarla', () => {
        cy.visit('http://localhost:4200/session/login');

        cy.get('input[name="email"]').type('hr@mail.com'); //Este usuario es de rrhh
        cy.get('input[name="password"]').type('contra123');

        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/employee-management');

        cy.get('button[data-cy="go-vacations"]').click();

        //Rechazar la solicitud
        cy.get('button[data-cy="reject-request"]').click();

        //Esperar mensaje de rechazo
        cy.contains('La solicitud del empleado para sus vacaciones ha sido rechazado').should('exist');

        //Cerrar el modal
        cy.get('button[data-cy="close-modal"]').click();

        //Crear una nueva solicitud
        cy.get('button[data-cy="create-vacation"]').click();

        //Llenar el formulario
        cy.wait(1000); // Opcional, si el render es lento

        // Llenar la fecha de inicio
        cy.get('input[name="startDate"]').type('2026-09-01');

        // Llenar los días de vacaciones
        cy.get('input[name="salary"]').clear().type('15');

        // Seleccionar el empleado solicitante (por su texto visible o índice si es dinámico)
        cy.get('select[name="area"]').select('Brayan Farm'); // Puedes usar el índice o `.select('Nombre del empleado')`

        // Botón "Confirmar"
        cy.contains('button', 'Confirmar').click();

        cy.contains('La solicitud de vacaciones del empleado ha sido registrado, el encargado de su area lo revisara').should('exist');

        //Cerrar el modal
        cy.get('button[data-cy="close-modal"]').click();

        //Aprobar la solicitud
        cy.get('button[data-cy="approve-request"]').click();

        //Esperar mensaje de aprobación
        cy.contains('La solicitud de vacaciones del empleado ha sido aceptada con exito').should('exist');
    })
});