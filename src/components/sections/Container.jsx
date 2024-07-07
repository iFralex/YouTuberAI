export function Container(props) {
  return (
    <div
      id={props.id || ""}
      className={`container p-8 mx-auto xl:px-0 ${props.className ? props.className : ""}`}>
      {props.children}
    </div>
  );
}

