import { Request, Response } from "express";
import { DomainError } from "../domain/DomainError";

type TError = DomainError | Error | string;

export abstract class Controller {
  protected abstract execute(req: Request, res: Response): Promise<void | any>;

  public async bind(req: Request, res: Response): Promise<void> {
    try {
      await this.execute(req, res);
    } catch (err) {
      console.log(`[Controller]: Uncaught controller error`);
      console.log(err);
      this.fail(res, "An unexpected error occurred");
    }
  }

  protected static jsonResponse(res: Response, code: number, message: string) {
    return res.status(code).json({ message });
  }

  protected ok<T>(res: Response, dto?: T) {
    if (!!dto) {
      res.type("application/json");
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  protected created(res: Response) {
    return res.sendStatus(201);
  }

  protected clientError(res: Response, error?: TError) {
    return Controller.jsonResponse(
      res,
      400,
      error?.toString() || "Bad Request"
    );
  }

  protected unauthorized(res: Response, error?: TError) {
    return Controller.jsonResponse(
      res,
      401,
      error?.toString() || "Unauthorized"
    );
  }

  protected notFound(res: Response, error?: TError) {
    return Controller.jsonResponse(res, 404, error?.toString() || "Not found");
  }

  protected conflict(res: Response, error?: TError) {
    return Controller.jsonResponse(res, 409, error?.toString() || "Conflict");
  }

  protected fail(res: Response, error: TError) {
    console.log(error);
    return res.status(500).json({
      message: error.toString(),
    });
  }
}
