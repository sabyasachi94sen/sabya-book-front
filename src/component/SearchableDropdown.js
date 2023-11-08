import { Input } from "antd";
import { useEffect, useRef, useState } from "react";

import {
    SearchOutlined,
} from '@ant-design/icons';

const SearchableDropdown = ({
    options,
    label,
    id,
}) => {
    const [query, setQuery] = useState("");
    const [list, setList] = useState([])
    const [isOpen, setIsOpen] = useState(false);

    const inputRef = useRef(null);

    const handleChange = (e) => {
        if (options?.length) {
            setIsOpen(true)
            setQuery(e.target.value)
            const optionList = options.filter(it => it[label].includes(e.target.value));
            setList(optionList)
        }
    }

    const visitProfile = (user_id) => {
        window.location.href = `/profile/${user_id}`

    }


    return (
        <div className="dropdown">
            <Input
                addonBefore={<SearchOutlined style={{ color: "white" }} />}
                ref={inputRef}
                type="text"
                name="searchTerm"
                className="ip"
                placeholder="Search"
                onChange={handleChange}
            />

            {<div className={`options ${isOpen ? "open" : ""}`}>
                {list?.map((options, index) => {
                    return (
                        <div className={`user-info`} onClick={() => visitProfile(options.user_id)}>
                            <img className="profile_pic"
                                src={options.profile_pic}
                            />
                            <div className='user-post-status'>
                                <span className='name'>{options[label]}</span>
                            </div>
                        </div>
                    );
                })}
            </div>}
        </div>
    );
};

export default SearchableDropdown;
