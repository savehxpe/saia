import { StudioProvider, useStudio } from "./store/StudioContext";
import AppShell from "./components/AppShell";
import Dashboard from "./components/Dashboard";
import PromptGenerator from "./components/PromptGenerator";
import ReferenceLab from "./components/ReferenceLab";
import SamplePackBuilder from "./components/SamplePackBuilder";
import PitchRoom from "./components/PitchRoom";
import ExportPanel from "./components/ExportPanel";

function StudioRouter() {
  const { activeView } = useStudio();
  switch (activeView) {
    case "dashboard":           return <Dashboard />;
    case "prompt-generator":    return <PromptGenerator />;
    case "reference-lab":       return <ReferenceLab />;
    case "sample-pack-builder": return <SamplePackBuilder />;
    case "pitch-room":          return <PitchRoom />;
    case "export-panel":        return <ExportPanel />;
    default:                    return <Dashboard />;
  }
}

export default function App() {
  return (
    <StudioProvider>
      <AppShell>
        <StudioRouter />
      </AppShell>
    </StudioProvider>
  );
}
