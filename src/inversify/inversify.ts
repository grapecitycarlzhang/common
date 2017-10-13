import "reflect-metadata";
import { Container, interfaces } from "inversify";
import * as inversify from "inversify";
import getDecorators from "inversify-inject-decorators";

const container = new Container();

const DIEx = {container,...getDecorators(container)}
export {
    inversify as DI,
    DIEx
};