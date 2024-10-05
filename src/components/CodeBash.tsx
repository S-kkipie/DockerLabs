import { CopyBlock, dracula } from "react-code-blocks";

function CodeBash(props: { text: string }) {
  return (
    <div className="my-3 mx-2">
      <CopyBlock
        text={props.text}
        language={"bash"}
        showLineNumbers={false}
        theme={dracula}
        codeBlock
        
      />
    </div>
  );
}

export default CodeBash;
