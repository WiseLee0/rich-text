import { Editor } from "../../rich-text"

type FillsCompCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
    updateRender: () => void
}
export const FillsComp = (props: FillsCompCompProps) => {
    const { editorRef, updateRender } = props
    const editor = editorRef.current;

    return <></>
}