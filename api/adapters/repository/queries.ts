export const QUERIES = {
    GET_EMPLOYEES_OF : 'SELECT * FROM Employees WHERE organizationid=:organizationId',
    GET_ORGANIZATIONS : 'SELECT * FROM Organizations',
    GET_ORGANIZATION_TEAMS : 'SELECT * FROM Teams WHERE organizationid=:organizationId',
    GET_EMPLOYEE_TEAMS : 'SELECT * FROM EmployeeTeams INNER JOIN Employees ON EmployeeTeams.employeeid = Employees.id WHERE EmployeeTeams.teamid in (:teamsList)',
    GET_EMPLOYEE_SKILLS : 'SELECT * FROM EmployeeSkills WHERE employeeid=:employeeId',
    GET_SKILLS : `SELECT * FROM Skills`,
    GET_ORGANIZATION_PROJECTS : 'SELECT * FROM Projects WHERE organizationid=:organizationId ORDER BY id ASC',
    GET_ORGANIZATION_PROJECTS_LIMIT_PROD : 'SELECT DISTINCT * FROM Projects INNER JOIN ProductsProjects ON ProductsProjects.projectid=Projects.id WHERE Projects.organizationid=:organizationId AND ProductsProjects.productid=:selectedProductIdFilter ORDER BY Projects.projecttypeid ASC LIMIT :limitmin,:limitmax',
    GET_ORGANIZATION_PROJECTS_LIMIT: 'SELECT DISTINCT * FROM Projects INNER JOIN ProductsProjects ON ProductsProjects.projectid=Projects.id WHERE Projects.organizationid=:organizationId ORDER BY Projects.projecttypeid ASC LIMIT :limitmin,:limitmax',
    GET_PROJECT_TYPES : `SELECT * FROM ProjectTypes`,
}