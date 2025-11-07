interface FormErrorMessageProps {
  message?: string;
}

export function FormErrorMessage({ message }: FormErrorMessageProps) {
  if (!message) {
    return null;
  }

  return <span className="text-sm text-red-500">{message}</span>;
}
