describe('Create user', () => {
  it('deberia crear un usuario de farmacia desde el rrhh', () => {
    cy.visit('http://localhost:4200/session/login');

    // Llenar el formulario
    cy.get('input[name="email"]').type('hr@mail.com'); //Este usuario es de rrhh
    cy.get('input[name="password"]').type('contra123');

    // Enviar el formulario
    cy.get('button[type="submit"]').click();

    // Esperar redirección al dashboard de administrador
    cy.url().should('include', '/employee-management');

    // Ir al formulario de registro de empleado
    cy.get('button[data-cy="register-employee"]').click();

    // Llenar el formulario. PASO 1
    cy.get('input[name="name"]').type('Brayan Farm');
    cy.get('input[name="cui"]').type('5555555555555');
    cy.get('input[name="phone"]').type('55112233');
    cy.get('input[name="email"]').type('brayan.quialo@gmail.com');
    cy.get('select[name="area"]').select('Farmacia'); 
    cy.contains('button', 'Siguiente').click();

    // Llenar el formulario. PASO 2
    cy.get('input[name="startDate"]', { timeout: 10000 }).should('be.visible');
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const formattedDate = threeMonthsAgo.toISOString().split('T')[0];

    cy.get('input[name="startDate"]').type(formattedDate);
    cy.get('input[name="salary"]').type('5000');
    cy.get('input[name="iggs"]').type('4.83');
    cy.get('input[name="irtra"]').type('1.00');
    cy.contains('button', 'Siguiente').click();

    //Confirmar que se esta en el paso 3
    cy.contains('Confirmación').should('exist');

    //Completar el registro
    cy.get('button[data-cy="confirm-register"]').click();

    //Esperar confirmacion de registro
    cy.contains('Empleado Registrado con exito').should('exist');

  });

  it('Registrar un usuario de farmacia', () => {
    cy.visit('http://localhost:4200/session/register');

    // Llenar campos del formulario
    cy.get('input[name="cui"]').type('5555555555555');
    cy.get('input[name="email"]').type('brayan.quialo@gmail.com');
    cy.get('input[name="password"]').first().type('contra123');
    cy.get('input[name="password"]').last().type('contra123');

    // Enviar el formulario
    cy.get('button[type="submit"]').click();

    // Verifica que se haya redirigido o mostrado un mensaje esperado
    cy.url().should('include', '/session/confirmation');

    //Ingresar el codigo de confirmacion
    cy.get('input[name="code"]').type('123456');
    cy.get('button[type="submit"]').click();

    //Esperar mensaje de confirmacion
    cy.contains('El administrador debera a aprobar su cuenta para que pueda acceder al sistema').should('exist');
  });

  it('Activar la solicitud del usuario', () => {
    cy.visit('http://localhost:4200/session/login');

    // Llenar el formulario
    cy.get('input[name="email"]').type('admin@mail.com'); //Este usuario es de administrador
    cy.get('input[name="password"]').type('contra123');

    // Enviar el formulario
    cy.get('button[type="submit"]').click();

    //Activar el empleado
    cy.get('button[data-cy="manage-employee"]').click();

    cy.url().should('include', '/admin/management-users');

    //Activar el usuario
    cy.get('button[data-cy="approve-request"]').click();

    cy.contains('El estado del usario se actualizo exitosamente').should('exist');
  });

  it('debería iniciar sesión con el rol de farmacia', () => {
    cy.visit('http://localhost:4200/session/login');

    cy.get('input[name="email"]').type('brayan.quialo@gmail.com');
    cy.get('input[name="password"]').type('contra123');

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/pharmacy');
  });

  it('Deberia de fallar el login', () => {
    cy.visit('http://localhost:4200/session/login');

    cy.get('input[name="email"]').type('brayan.quialo@gmail.com');
    cy.get('input[name="password"]').type('contra1234');

    cy.get('button[type="submit"]').click();

    cy.contains('El email o la contraseña es incorrecta').should('exist');
  })
});
