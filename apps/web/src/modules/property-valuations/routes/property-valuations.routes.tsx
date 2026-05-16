import { Route } from "react-router-dom";
import { AgentLandValuationPage } from "../pages/agent-land-valuation-page/agent-land-valuation-page";

export const propertyValuationsRoutes = [
  <Route
    key="agent-land-valuation"
    path="/agente/avaluo-terrenos"
    element={<AgentLandValuationPage />}
  />,
];
