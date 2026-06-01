import type { Request, Response } from "express";
import { issueService } from "./issue.service.js";
import sendResponse from "../../utility/sendResponse.js";
import type { IUser } from "./issue.interface.js";

const createIssue = async(req: Request, res: Response) => {
    try {
        const result = await issueService.createIssueIntoDB(req.body, req.user as IUser);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

const getAllIssues = async(req: Request, res: Response) => {
    try {
        const result = await issueService.getAllIssuesFromDB(req.query);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrived successfully",
            data: result
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

const getSingleIssue = async(req: Request, res: Response) => {
    try {
        const result = await issueService.getSingleIssueFromDB(req.params.id as string);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue retrived successfully",
            data: result
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue
};