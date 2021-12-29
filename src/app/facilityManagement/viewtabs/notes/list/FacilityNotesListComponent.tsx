import { Button, IconButton, InputAdornment, Menu, MenuItem, TextField } from '@material-ui/core';
import { AddRounded } from '@material-ui/icons';
import Filter from '@material-ui/icons/FilterList';
import MoreVert from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import React, { useState } from 'react';
import { cardMenuActions } from '../../../../../constants/data';
import FacilityNotesAddScreen from '../add/FacilityNotesAddScreen';
import './FacilityNotesListComponent.scss';
import ReadMore from './readmore/ReadMore';

const FacilityNotesListComponent = () => {
    const [isList, setIsList] = useState<boolean>(true);
    const [notes, setNotes] = React.useState<any>([])

    return !isList ? <FacilityNotesAddScreen setIsList={setIsList} setNotes={setNotes} notes={notes} /> : <FacilityNotesCardList notes={notes} setIsList={setIsList} />
}


const FacilityNotesCardList = (props: any) => {
    const { notes } = props
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);

    };
    const handleToggleNotes = () => {
        props.setIsList((prevState: boolean) => !prevState)
    }

    const handleSearch = (e: any) => {
        console.log(e.target.value)
    }

    return <div className='facility-notes-card-list'>
        <div className="header-action-grp">
            <div className='notes-search'>
                <TextField
                    placeholder='Search'
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon
                                    color={"primary"}
                                    id="icon_search_sms_blast"
                                    style={{ cursor: "pointer" }}
                                />
                            </InputAdornment>
                        ),
                    }}
                    variant='outlined'
                    type="search"
                    size='small'
                    onChange={handleSearch}
                    fullWidth
                />
            </div>
            <div className='notes-action-grp'>
                <Button variant="outlined" startIcon={<Filter />}>
                    Filter
                </Button>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={handleToggleNotes}
                >
                    <AddRounded />
                    &nbsp;&nbsp;Add Notes
                </Button>
            </div>
        </div>
        {
            notes.length > 0 && notes.map((item: any, index: number) => {
                return <FacilityNoteCard anchorEl={anchorEl} open={open} handleClick={handleClick} handleClose={handleClose} />
            })
        }
    </div>
}


const FacilityNoteCard = (props: any) => {
    const { handleClick, open, anchorEl, handleClose } = props

    return <div className='notes-card' >
        <div className='note-menu-action'>
            <div>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls="long-menu"
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVert />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: 48 * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    {cardMenuActions.map((option: any, index) => (
                        <MenuItem key={index} onClick={() => {
                            handleClose();
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", gap: '0.5rem' }} >
                                <span> {option?.icon}</span>
                                <span>{option?.label}</span>
                            </div>
                        </MenuItem>
                    ))}
                </Menu>
            </div>

        </div>
        <div className="card-header-container">
            <p className='title'>Note Title</p>
            <p className='subtitle'>Added by : Harvey Specter &nbsp; |&nbsp; July 2021  &nbsp;|&nbsp; 8:30PM</p>
        </div>
        <div className='card-content-container'>
            <ReadMore content="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae ea veniam facilis nisi cum porro nostrum necessitatibus iusto? Praesentium iure dicta eligendi hic, esse vero magni necessitatibus doloribus voluptate ab?
Veritatis accusantium ad harum porro, blanditiis, dolore alias odio aliquid tempore nostrum doloremque quae explicabo sequi. Rerum, eaque earum, mollitia perspiciatis aut quidem eos autem reiciendis, delectus rem tempore enim.
Esse, voluptate debitis! Blanditiis molestias maxime magnam libero maiores, et consectetur voluptatem accusantium itaque possimus alias eligendi, inventore eius reiciendis saepe repellat obcaecati iure esse tenetur veniam molestiae distinctio error.
Doloremque quis omnis excepturi incidunt repudiandae hic at eaque perspiciatis enim odio, debitis doloribus blanditiis iste, dignissimos vero amet fugit explicabo placeat odit. Cupiditate deleniti blanditiis minus nisi perspiciatis. Numquam.
Aut ducimus fugiat pariatur quisquam quis! Consequatur recusandae id ea eius aperiam a eum laudantium placeat ipsum ut quae molestias, nihil libero iusto, nostrum dicta perferendis eaque dolore totam quasi?
Dolore recusandae neque illo expedita veniam, eveniet sapiente tempore doloremque facilis pariatur, repudiandae, incidunt accusantiu."/>
        </div>
    </div>
}

export default FacilityNotesListComponent;