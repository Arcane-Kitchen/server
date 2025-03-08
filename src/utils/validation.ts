import { Response } from "express";

// Helper function for validating token
export const validateToken = (token:string|undefined, res: Response) => {
    if (!token) {
        res.status(403).json({ error: "No token provided" });
        return false;
    }
    return true;
};

// Helper function for validating props
export const validateProps = (
    props: Record<string, any>,
    requiredProps: string[],
    res: Response
): boolean => {
    for (const prop of requiredProps) {
        if (!props[prop]) {
            res.status(400).json({ error: `${prop} is required` });
            return false;
        }
    }
    return true;
};