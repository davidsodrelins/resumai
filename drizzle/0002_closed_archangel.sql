CREATE TABLE `cover_letters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`resume_id` int,
	`title` varchar(255) NOT NULL,
	`company_name` varchar(255),
	`job_title` varchar(255),
	`job_description` text,
	`content` text NOT NULL,
	`language` enum('pt','en','es') NOT NULL,
	`template` enum('classic','modern','minimal','executive','creative') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cover_letters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_resumes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`resume_data` text NOT NULL,
	`model` enum('reduced','mixed','complete') NOT NULL,
	`language` enum('pt','en','es') NOT NULL,
	`template` enum('classic','modern','minimal','executive','creative') NOT NULL,
	`is_draft` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `saved_resumes_id` PRIMARY KEY(`id`)
);
