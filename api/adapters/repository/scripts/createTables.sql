DROP TABLE IF EXISTS ProductsProjects;
DROP TABLE IF EXISTS EmployeeSkills;
DROP TABLE IF EXISTS EmployeeTeams;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS Teams;
DROP TABLE IF EXISTS KnowledgeLevels;
DROP TABLE IF EXISTS Skills;
DROP TABLE IF EXISTS ExperienceRanges;
DROP TABLE IF EXISTS Projects;
DROP TABLE IF EXISTS ProjectTypes;
DROP TABLE IF EXISTS Organizations;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS WorkProjectOrganizationProduct;
DROP TABLE IF EXISTS EmployeesOrganizationProduct;
DROP TABLE IF EXISTS ProductsOrganizations;

CREATE TABLE Roles (
`id` INT NOT NULL,
`name` TEXT NOT NULL,
`description` TEXT NOT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE Products (
`id` INT NOT NULL,
`name` TEXT NOT NULL,
`description` TEXT NOT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE Organizations (
`id` INT NOT NULL,
`name` TEXT NOT NULL,
`description` TEXT NOT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE Employees (
`id` INT NOT NULL,
`name` TEXT NOT NULL,
`surname` TEXT NOT NULL,
`username` TEXT NULL,
`slackid` TEXT NULL,
`roleid` INT NOT NULL,
`organizationid` INT NULL,
PRIMARY KEY (`id`),
FOREIGN KEY (roleid) REFERENCES Roles(id),
FOREIGN KEY (organizationid) REFERENCES Organizations(id)
);

CREATE TABLE Teams (
`id` INT NOT NULL,
`name` TEXT,
`description` TEXT NOT NULL,
`organizationid` INT NOT NULL,
PRIMARY KEY (`id`),
FOREIGN KEY (organizationid) REFERENCES Organizations(id)
);

CREATE TABLE EmployeeTeams (
`id` INT NOT NULL AUTO_INCREMENT,
`teamid` INT NOT NULL,
`employeeid` INT NOT NULL,
PRIMARY KEY (`id`),
FOREIGN KEY (teamid) REFERENCES Teams(id),
FOREIGN KEY (employeeid) REFERENCES Employees(id)
);

CREATE TABLE Skills (
`id` INT NOT NULL,
`name` TEXT NOT NULL,
`description` TEXT NOT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE KnowledgeLevels (
`id` INT NOT NULL,
`name` TEXT NOT NULL,
`description` TEXT NOT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE ExperienceRanges (
`id` INT NOT NULL,
`name` TEXT NOT NULL,
`description` TEXT NOT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE EmployeeSkills (
`employeeid` INT NOT NULL,
`skillid` INT NOT NULL,
`knowledgelevelid` INT NOT NULL,
`experiencerangeid` INT NOT NULL,
FOREIGN KEY (knowledgelevelid) REFERENCES KnowledgeLevels(id),
FOREIGN KEY (experiencerangeid) REFERENCES ExperienceRanges(id)
);

CREATE TABLE ProjectTypes (
`id` INT NOT NULL,
`name` TEXT NOT NULL,
`description` TEXT NOT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE Projects (
`id` INT NOT NULL,
`organizationid` INT NOT NULL,
`coderepositoryid` INT NOT NULL,
`name` TEXT NOT NULL,
`projecttypeid` INT NOT NULL,
`codeanalyzerprojectid` TEXT NOT NULL,
`repositorypackageid` TEXT NOT NULL,
`documentationspacename` TEXT NOT NULL,
`documentationpagename` TEXT NOT NULL,
`jenkinsgroup` TEXT NOT NULL,
`jenkinsprojectname` TEXT NOT NULL,
`xldeployapplicationid` TEXT NULL,
FOREIGN KEY (organizationid) REFERENCES Organizations(id),
FOREIGN KEY (projecttypeid) REFERENCES ProjectTypes(id)
);

CREATE TABLE ProductsOrganizations (
`productid` INT NOT NULL,
`organizationId` INT NOT NULL
);

CREATE TABLE ProductsProjects (
`productid` INT NOT NULL,
`projectid` INT NOT NULL
);

CREATE TABLE WorkProjectOrganizationProduct (
`workprojectid` INT NOT NULL,
`organizationid` INT NOT NULL,
`productid` INT NOT NULL
);

CREATE TABLE EmployeesOrganizationProduct (
`employeeid` INT NOT NULL,
`organizationid` INT NOT NULL,
`productid` INT NOT NULL
);