import Image from "next/image";
import { Input } from "../ui/input";

function Searchbar({ value, onChange }) {
  return (
    <div className='searchbar'>
      <Image
        src='/assets/search-gray.svg'
        alt='search'
        width={24}
        height={24}
        className='object-contain'
      />
      <Input
        id='text'
        value={value}
        onChange={onChange}
        placeholder={"Find someone..."}
        className='no-focus searchbar_input'
      />
    </div>
  );
}

export default Searchbar;