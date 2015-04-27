--
-- Insert Contributorship Badges data into `images` table
-- see: http://dictionary.casrai.org/Contributor_Roles
-- desc images;
-- +----------+--------------+------+-----+---------+----------------+
-- | Field    | Type         | Null | Key | Default | Extra          |
-- +----------+--------------+------+-----+---------+----------------+
-- | id       | int(11)      | NO   | PRI | NULL    | auto_increment |
-- | slug     | varchar(255) | NO   | UNI | NULL    |                |
-- | url      | varchar(255) | YES  |     | NULL    |                |
-- | mimetype | varchar(255) | YES  |     | NULL    |                |
-- | data     | longblob     | YES  |     | NULL    |                |
-- +----------+--------------+------+-----+---------+----------------+
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES
  (NULL,'conceptualization-img','https://s3.amazonaws.com/mozillascience/badges/conceptualization.png',NULL,NULL),
  (NULL,'data_curation-img','https://s3.amazonaws.com/mozillascience/badges/data_curation.png',NULL,NULL),
  (NULL,'formal_analysis-img','https://s3.amazonaws.com/mozillascience/badges/formal_analysis.png',NULL,NULL),
  (NULL,'funding-img','https://s3.amazonaws.com/mozillascience/badges/funding.png',NULL,NULL),
  (NULL,'investigation-img','https://s3.amazonaws.com/mozillascience/badges/investigation.png',NULL,NULL),
  (NULL,'methodology-img','https://s3.amazonaws.com/mozillascience/badges/methodology.png',NULL,NULL),
  (NULL,'project_administration-img','https://s3.amazonaws.com/mozillascience/badges/project_administration.png',NULL,NULL),
  (NULL,'resources-img','https://s3.amazonaws.com/mozillascience/badges/resources.png',NULL,NULL),
  (NULL,'software-img','https://s3.amazonaws.com/mozillascience/badges/software.png',NULL,NULL),
  (NULL,'supervision-img','https://s3.amazonaws.com/mozillascience/badges/supervision.png',NULL,NULL),
  (NULL,'validation-img','https://s3.amazonaws.com/mozillascience/badges/testing.png',NULL,NULL),
  (NULL,'data_visualization-img','https://s3.amazonaws.com/mozillascience/badges/data_visualization.png',NULL,NULL),
  (NULL,'writing_initial-img','https://s3.amazonaws.com/mozillascience/badges/writing_initial.png',NULL,NULL),
  (NULL,'writing_review-img','https://s3.amazonaws.com/mozillascience/badges/writing_review.png',NULL,NULL);
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Insert Contributorship Badges data into `badges` table
-- see: http://dictionary.casrai.org/Contributor_Roles
-- desc badges;
-- +---------------------+--------------------------------------------+------+-----+-------------------+----------------+
-- | Field               | Type                                       | Null | Key | Default           | Extra          |
-- +---------------------+--------------------------------------------+------+-----+-------------------+----------------+
-- | id                  | int(11)                                    | NO   | PRI | NULL              | auto_increment |
-- | slug                | varchar(255)                               | NO   | UNI | NULL              |                |
-- | name                | varchar(255)                               | NO   |     | NULL              |                |
-- | strapline           | varchar(140)                               | YES  |     | NULL              |                |
-- | earnerDescription   | text                                       | NO   |     | NULL              |                |
-- | consumerDescription | text                                       | NO   |     | NULL              |                |
-- | issuerUrl           | varchar(255)                               | YES  |     | NULL              |                |
-- | rubricUrl           | varchar(255)                               | YES  |     | NULL              |                |
-- | criteriaUrl         | varchar(255)                               | NO   |     | NULL              |                |
-- | timeValue           | int(11)                                    | YES  |     | NULL              |                |
-- | timeUnits           | enum('minutes','hours','days','weeks')     | YES  |     | NULL              |                |
-- | limit               | int(11)                                    | YES  |     | NULL              |                |
-- | unique              | tinyint(1)                                 | NO   |     | 0                 |                |
-- | archived            | tinyint(1)                                 | NO   |     | 0                 |                |
-- | created             | timestamp                                  | NO   |     | CURRENT_TIMESTAMP |                |
-- | imageId             | int(11)                                    | NO   |     | NULL              |                |
-- | programId           | int(11)                                    | YES  |     | NULL              |                |
-- | issuerId            | int(11)                                    | YES  |     | NULL              |                |
-- | systemId            | int(11)                                    | YES  |     | NULL              |                |
-- | type                | varchar(255)                               | NO   |     | NULL              |                |
-- | evidenceType        | enum('URL','Text','Photo','Video','Sound') | YES  |     | NULL              |                |
-- +---------------------+--------------------------------------------+------+-----+-------------------+----------------+
--

LOCK TABLES `badges` WRITE;
/*!40000 ALTER TABLE `badges` DISABLE KEYS */;
INSERT INTO `badges` VALUES
  (NULL,'conceptualization','Conceptualization',NULL,'Ideas; formulation or evolution of overarching research goals and aims.','Ideas; formulation or evolution of overarching research goals and aims.',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL),
  (NULL,'data_curation','Data curation',NULL,'Management activities to annotate (produce metadata), scrub data and maintain research data (including software code, where it is necessary for interpreting the data itself) for initial use and later re-use.','Management activities to annotate (produce metadata), scrub data and maintain research data (including software code, where it is necessary for interpreting the data itself) for initial use and later re-use.',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL),
  (NULL,'formal_analysis','Formal analysis',NULL,'Application of statistical, mathematical, computational, or other formal techniques to analyse or synthesize study data.','Application of statistical, mathematical, computational, or other formal techniques to analyse or synthesize study data.',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL),
  (NULL,'funding','Funding acquisition',NULL,'Acquisition of the financial support for the project leading to this publication.','Acquisition of the financial support for the project leading to this publication.',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL),
  (NULL,'investigation','Investigation',NULL,'Conducting a research and investigation process, specifically performing the experiments, or data/evidence collection.','Conducting a research and investigation process, specifically performing the experiments, or data/evidence collection.',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL),
  (NULL,'methodology','Methodology',NULL,'Development or design of methodology; creation of models.','Development or design of methodology; creation of models.',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL),
  (NULL,'project_administration','Project administration',NULL,'Management and coordination responsibility for the research activity planning and execution.','Management and coordination responsibility for the research activity planning and execution.',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL),
  (NULL,'resources','Resources',NULL,'Provision of study materials, reagents, materials, patients, laboratory samples, animals, instrumentation, computing resources, or other analysis tools.','Provision of study materials, reagents, materials, patients, laboratory samples, animals, instrumentation, computing resources, or other analysis tools.',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL),
  (NULL,'software','Software',NULL,'Programming, software development; designing computer programs; implementation of the computer code and supporting algorithms; testing of existing code components.','Programming, software development; designing computer programs; implementation of the computer code and supporting algorithms; testing of existing code components.',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL),
  (NULL,'supervision','Supervision',NULL,'Oversight and leadership responsibility for the research activity planning and execution, including mentorship external to the core team.','Oversight and leadership responsibility for the research activity planning and execution, including mentorship external to the core team.',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL),
  (NULL,'validation','Validation',NULL,'Verification, whether as a part of the activity or separate, of the overall replication/reproducibility of results/experiments and other research outputs.','Verification, whether as a part of the activity or separate, of the overall replication/reproducibility of results/experiments and other research outputs.',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL),
  (NULL,'data_visualization','Data visualization',NULL,'Preparation, creation and/or presentation of the published work, specifically visualization/data presentation.','Preparation, creation and/or presentation of the published work, specifically visualization/data presentation.',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL),
  (NULL,'writing_initial','Writing - original draft',NULL,'Preparation, creation and/or presentation of the published work, specifically writing the initial draft (including substantive translation).','Preparation, creation and/or presentation of the published work, specifically writing the initial draft (including substantive translation).',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL),
  (NULL,'writing_review','Writing - review & editing',NULL,'Preparation, creation and/or presentation of the published work by those from the original research group, specifically critical review, commentary or revision – including pre- or post-publication stages.','Preparation, creation and/or presentation of the published work by those from the original research group, specifically critical review, commentary or revision – including pre- or post-publication stages.',NULL,NULL,'http://dictionary.casrai.org/Contributor_Roles',NULL,NULL,NULL,0,0,NULL,1,NULL,NULL,1,'contributor',NULL);
/*!40000 ALTER TABLE `badges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Insert correct imageId in badges table (id autoincremented on insert)
--

UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'conceptualization-img') WHERE slug = 'conceptualization';
UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'data_curation-img') WHERE slug = 'data_curation';
UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'formal_analysis-img') WHERE slug = 'formal_analysis';
UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'funding-img') WHERE slug = 'funding';
UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'investigation-img') WHERE slug = 'investigation';
UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'methodology-img') WHERE slug = 'methodology';
UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'project_administration-img') WHERE slug = 'project_administration';
UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'resources-img') WHERE slug = 'resources';
UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'software-img') WHERE slug = 'software';
UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'supervision-img') WHERE slug = 'supervision';
UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'validation-img') WHERE slug = 'validation';
UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'data_visualization-img') WHERE slug = 'data_visualization';
UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'writing_initial-img') WHERE slug = 'writing_initial';
UPDATE `badges` SET imageId = (SELECT id FROM images where slug = 'writing_review-img') WHERE slug = 'writing_review';
