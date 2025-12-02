CREATE TABLE `resume_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`userPrompt` text,
	`linkedinUrl` varchar(500),
	`uploadedFileUrls` json,
	`extractedData` json,
	`generatedResumes` json,
	`status` enum('processing','completed','failed') NOT NULL DEFAULT 'processing',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resume_sessions_id` PRIMARY KEY(`id`)
);
