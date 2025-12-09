import WorkflowBuilder from './components/WorkflowBuilder';

export default function App() {
  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden">
      <WorkflowBuilder />
    </div>
  );
}