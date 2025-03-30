import "./DateInput.css";
import { Input, InputProps } from "../input";
import LeftArrow from "../../../assets/left-svgrepo-com.svg";
import RightArrow from "../../../assets/right-svgrepo-com.svg";
import { formatDate } from "../../../pages/diary/Diary";

type Props = InputProps & {};

export const DateInput = ({
  onValueChange,
  value,
  onChange,
  ...rest
}: Props) => {
  const handleLeftClick = () => {
    const newValue = value ? new Date(value as string) : new Date();
    newValue.setDate(newValue.getDate());
    onValueChange?.({ value: formatDate(newValue) });
  };
  const handleRightClick = () => {
    const newValue = value ? new Date(value as string) : new Date();
    newValue.setDate(newValue.getDate() + 2);
    onValueChange?.({ value: formatDate(newValue) });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log({ e });
    onChange?.(e);
    onValueChange?.({ name: e.target.value, value: e.target.value });
  };
  return (
    <div className="date-input-container">
      <button
        style={{ backgroundColor: "transparent" }}
        onClick={handleLeftClick}
      >
        <img src={LeftArrow} height={24} width={24} />
      </button>
      <Input {...rest} onChange={handleInputChange} value={value} type="date" />
      <button
        style={{ backgroundColor: "transparent" }}
        onClick={handleRightClick}
      >
        <img src={RightArrow} height={24} width={24} />
      </button>
    </div>
  );
};
