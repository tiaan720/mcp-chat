interface ProjectOverviewProps {
  userName?: string;
}

export const ProjectOverview = ({ userName }: ProjectOverviewProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 mb-8">
      <div className="text-4xl font-bold text-center">
        {userName ? (
          <>
            <span className="text-foreground">Welcome </span>
            <span className="username-highlight">{userName}</span>
            <span className="text-foreground"> to OMNI Chat</span>
          </>
        ) : (
          <span className="text-foreground">OMNI Chat</span>
        )}
      </div>
      <p className="text-muted-foreground text-center text-sm">
        Start a conversation with your AI assistant
      </p>
    </div>
  );
};
