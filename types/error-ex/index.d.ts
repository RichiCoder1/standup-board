type LineFormat<T> = { line: (prop: T, stack: string) => string | null };
type StackFormat<T> = { stack: <T>(prop: any, stack: string) => void };
type MessageFormat<T> = { message: <T>(prop: any, message: string) => string };
type GenericFormat<T> = <T>(arg1: T) => string | null;

type InferLineFormatType<T> = T extends LineFormat<infer TT> ? TT : InferStackFormatType<T>;
type InferStackFormatType<T> = T extends StackFormat<infer TT> ? TT : InferMessageFormatType<T>;
type InferMessageFormatType<T> = T extends MessageFormat<infer TT> ? TT : any;
type InferErrorPropertyType<T> = T extends GenericFormat<infer TT> ? TT : InferLineFormatType<T>;

declare module 'error-ex' {
	type ErrorExProperty<T = any> =
		| GenericFormat<T>
		| LineFormat<T>
		| StackFormat<T>
		| MessageFormat<T>;
	interface ErrorEx {
		<TProps extends { [key: string]: ErrorExProperty }>(name: string, properties?: TProps): new (
			message?: string,
		) => { [P in keyof TProps]: InferErrorPropertyType<TProps[P]> } & Error;
		line<T = any>(format: string): GenericFormat<T>;
		append<T = any>(format: string): GenericFormat<T>;
	}
	const errorEx: ErrorEx;
	export = errorEx;
}
