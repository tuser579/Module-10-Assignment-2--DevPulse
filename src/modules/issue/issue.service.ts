import { pool } from "../../db/index.js";
import type { IIssue, IUser } from "./issue.interface.js";

const createIssueIntoDB = async(payload: IIssue, user: IUser) => {
    const result = await pool.query(
        `INSERT INTO issues (title, description, type, reporter_id  ) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`, 
        [payload.title, payload.description, payload.type, user.id]
    );
    return result.rows[0];
}

const getAllIssuesFromDB = async (query: Record<string, any>) => {
    const { sort, type, status } = query;

    let sql = `SELECT * FROM issues`;
    const queryParams: any[] = [];
    const filters: string[] = [];

    if (type) {
        queryParams.push(type);
        filters.push(`type = $${queryParams.length}`);
    }

    if (status) {
        queryParams.push(status);
        filters.push(`status = $${queryParams.length}`);
    }

    if (filters.length > 0) {
        sql += ` WHERE ` + filters.join(" AND ");
    }

    if (sort === "oldest") {
        sql += ` ORDER BY created_at ASC`;
    } else {
        sql += ` ORDER BY created_at DESC`;
    }

    const result = await pool.query(sql, queryParams);
    const issues = result.rows;

    if (issues.length === 0) {
        return issues;
    }

    const reporterIds = [...new Set(issues.map((issue: any) => issue.reporter_id))];
    const userResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = ANY($1)`,
        [reporterIds]
    );

    const userMap = userResult.rows.reduce((acc: any, user: any) => {
        acc[user.id] = user;
        return acc;
    }, {});

    const resultWithReporter = issues.map((issue: any) => {
        const { reporter_id, ...issueData } = issue;
        return {
            ...issueData,
            reporter: userMap[reporter_id] || null,
        };
    });

    return resultWithReporter;
};

const getSingleIssueFromDB = async (id: string) => {
    const result = await pool.query(
        `SELECT * FROM issues WHERE id = $1`,
        [id]
    );
    const issue = result.rows[0];

    if (!issue) {
        throw new Error("Issue not found");
    }

    const reporterResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = $1`,
        [issue.reporter_id]
    );

    const reporter = reporterResult.rows[0];

    delete issue.reporter_id;

    return {
        ...issue,
        reporter: reporter || null,
    };
}

const updateSingleIssueFromDB = async (id: string, payload: IIssue, user: IUser) => {
    const issue = await getSingleIssueFromDB(id);
    if(user.role === 'contributor' && issue.status !== 'open'){
        throw new Error("You are not authorized to update this issue");
    }

    const result = await pool.query(
        `UPDATE issues SET title = $1, description = $2, type = $3 WHERE id = $4 RETURNING *`,
        [payload.title, payload.description, payload.type, id]
    );

    if(result.rows.length === 0){
        throw new Error("Issue not found");
    }

    if(user.role === 'contributor' && result.rows[0].reporter_id !== user.id){
        throw new Error("You are not authorized to update this issue");
    }

    return result.rows[0];
}

const deleteSingleIssueFromDB = async (id: string) => {
    const result = await pool.query(
        `DELETE FROM issues WHERE id = $1 RETURNING *`,
        [id]
    );

    if(result.rows.length === 0){
        throw new Error("Issue not found");
    }

    return result.rows[0];
}

export const issueService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateSingleIssueFromDB,
    deleteSingleIssueFromDB
};