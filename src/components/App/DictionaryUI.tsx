import { capitalize_first_letter } from "../../Functions";
import { dictionaryResultProps } from "../../Types/components.types";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Description } from "./Description";

export const DictionaryUI: React.FC<dictionaryResultProps> = ({
  meanings,
  phonetics,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1">
        {phonetics.map((p, i) => (
          <i key={i}>{p.text}</i>
        ))}
      </div>
      {meanings.map((meaning, index) => (
        <div className="flex flex-col mt-2 gap-2" key={index}>
          <h2>{capitalize_first_letter(meaning.partOfSpeech)}</h2>
          <div className="w-full flex flex-col gap-3">
            {meaning.definitions.map((d, i) => (
              <div className="w-full" key={i}>
                <div className="w-full flex gap-4">
                  <Button
                    className="w-6 h-6 p-3 rounded-full"
                    variant={"outline"}
                    size={"icon"}
                  >
                    {i + 1}
                  </Button>
                  <Description text={capitalize_first_letter(d.definition)} />
                </div>
                {d.example && (
                  <div>
                    <p>Example</p>
                    <Description text={"- " + d.example} />
                  </div>
                )}
                {d.synonyms.map((s, _) => (
                  <Badge key={_}>{s}</Badge>
                ))}
              </div>
            ))}
          </div>
          {!!meaning.synonyms.length && <Description text="Synonyms" />}
          <div className="flex items-center flex-wrap gap-3">
            {meaning.synonyms.map((s, i) => (
              <Badge className="rounded-sm" key={i}>
                {s}
              </Badge>
            ))}
          </div>
        </div>
      ))}
      <hr />
    </div>
  );
};
