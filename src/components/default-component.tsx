interface DefaultComponentProps {
  teste: string;
}

export function DefaultComponent({ teste }: DefaultComponentProps) {
  return (
    <div>
      <span>{teste}</span>
    </div>
  );
}
