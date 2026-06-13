import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = process.env.PRESENTATION_FEATURE_ROOT
  ? path.resolve(process.env.PRESENTATION_FEATURE_ROOT)
  : path.resolve(__dirname, "../..");

type ResourceSpec = {
  filePath: string;
  mimeType: string;
};

const resources: Record<string, ResourceSpec> = {
  manifest: {
    filePath: path.join(packageRoot, "manifest.json"),
    mimeType: "application/json",
  },
  "style-guide": {
    filePath: path.join(packageRoot, "reference", "STYLE_GUIDE.md"),
    mimeType: "text/markdown",
  },
  "scene-grammar": {
    filePath: path.join(packageRoot, "reference", "scene-grammar.json"),
    mimeType: "application/json",
  },
  "examples/about-us": {
    filePath: path.join(packageRoot, "reference", "examples", "about-us-brief.md"),
    mimeType: "text/markdown",
  },
  "examples/pricing": {
    filePath: path.join(packageRoot, "reference", "examples", "pricing-brief.md"),
    mimeType: "text/markdown",
  },
};

const server = new McpServer({
  name: "presentation-feature-video-ads",
  version: "1.0.0",
});

for (const [resourceName, spec] of Object.entries(resources)) {
  const uri = `presentation-feature://${resourceName}`;

  server.resource(
    "presentation-feature",
    new ResourceTemplate(uri, { list: undefined }),
    async (requestedUri) => {
      const text = await readFile(spec.filePath, "utf8");

      return {
        contents: [
          {
            uri: requestedUri.href,
            mimeType: spec.mimeType,
            text,
          },
        ],
      };
    },
  );
}

const transport = new StdioServerTransport();
await server.connect(transport);
