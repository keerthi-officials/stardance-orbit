declare module "*.css";
declare module "data-text:*";
declare module "url:*";
declare module "*.css?raw" {
  const content: string;
  export default content;
}