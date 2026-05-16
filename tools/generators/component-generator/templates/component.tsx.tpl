import './{{PascalName}}.css';

interface {{PascalName}}Props {
  label: string;
}

export function {{PascalName}}({ label }: {{PascalName}}Props) {
  return <div className="{{kebabName}}">{label}</div>;
}
