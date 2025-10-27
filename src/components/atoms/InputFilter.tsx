import {useState,type FormEvent} from 'react';

type InputFilterProps = {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
};

const InputFilter = ({ onSearch, placeholder = "" }: InputFilterProps) => {
    const [searchTerm,setSearchTerm]=useState('');

    const handleChange=(event: React.ChangeEvent<HTMLInputElement>) => {
        const value: string=event.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <form action="" onSubmit={(e: FormEvent<HTMLFormElement>): void => e.preventDefault()}>
            <input className='border-solid border-2 placeholder:text-gray-500 outline-none bg-transparent border-secundary rounded-lg  h-10 w-56 text-sm text-gray-200 px-2'
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder={placeholder}
            />
        </form>
    );
};

export default InputFilter;
