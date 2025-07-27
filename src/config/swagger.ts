import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JangbiGO Backend API",
      version: "1.0.0",
      description:
        "A comprehensive Node.js backend API with Kakao OAuth authentication",
      contact: {
        name: "API Support",
        email: "support@jangbigo.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/types/*.ts"],
};

export const specs = swaggerJsdoc(options);
