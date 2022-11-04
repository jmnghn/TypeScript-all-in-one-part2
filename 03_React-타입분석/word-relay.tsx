// import * as React from "react";
import axios from "axios";
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  FunctionComponent,
  ReactElement,
  FC,
  ReactNode,
} from "react";

type Props = {
  name: string;
  title: string;
  children?: ReactNode | undefined;
};

const WordRelay: FC<Props> = (props) => {
  const [word, setWord] = useState("first");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const inputEl = useRef(null);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      const input = inputEl.current;
      if (word[word.length - 1] === value[0]) {
        setResult("딩동댕");
        setWord(value);
        setValue("");
        if (input) {
          input.focus();
        }
      } else {
        setResult("땡");
        setValue("");
        if (input) {
          input.focus();
        }
      }
    },
    [word, value]
  );

  const onChange = useCallback((e) => {
    setValue(e.currentTarget.value);
  }, []);

  return (
    <>
      <div>{word}</div>
      <form onSubmit={onSubmitForm}>
        <input ref={inputEl} value={value} onChange={onChange} />
        <button>입력!</button>
      </form>
      <div>{result}</div>
    </>
  );
};

const Parent = () => {
  return (
    <WordRelay name="이름" title="타이틀">
      <div></div>
    </WordRelay>
  );
};

export default WordRelay;
