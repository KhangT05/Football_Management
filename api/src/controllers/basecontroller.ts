import { Request, Response, NextFunction } from "express";
import { makeResponse } from "../common/response/apiresponse.js";
import { BaseService } from "../services/baseservice.js";

export abstract class BaseController<T, CreateDTO, UpdateDTO> {
    constructor(
        protected readonly service: BaseService<T, CreateDTO, UpdateDTO>
    ) { }

    protected ok<D>(res: Response, data: D, message = "Success"): void {
        res.status(200).json(makeResponse(data, message));
    }

    protected created<D>(res: Response, data: D, message = "Created"): void {
        res.status(201).json(makeResponse(data, message));
    }

    protected noContent(res: Response, message = "Deleted"): void {
        res.status(204).json(makeResponse(null, message));
    }

    findAll = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            this.ok(res, await this.service.findAll());
        } catch (err) { next(err); }
    };

    findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.ok(res, await this.service.findByIdOrFail(Number(req.params.id)));
        } catch (err) { next(err); }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.created(res, await this.service.create(req.body));
        } catch (err) { next(err); }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.ok(res, await this.service.update(Number(req.params.id), req.body), "Updated");
        } catch (err) { next(err); }
    };

    softDelete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.service.softDelete(Number(req.params.id));
            this.noContent(res);
        } catch (err) { next(err); }
    };
}