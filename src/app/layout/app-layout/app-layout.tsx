import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import IconButton from "@material-ui/core/IconButton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from '@material-ui/icons/Menu';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from "react-router-dom";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './app-layout.scss';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../store/actions/auth.action";
import MenuItemsComponent from "../../../components/MenuItemsComponent";
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import Communications from "../../../helpers/communications-service";
import { StateParams } from "../../../store/reducers";
import { ImageConfig } from '../../../constants';
import Avatar from '@material-ui/core/Avatar';
import { Logout } from '../../../constants/ImageConfig';

export interface AppLayoutProps {

}

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerContainer: {
            overflow: 'auto',
        },
        content: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
    }),
);


const AppLayout = (props: PropsWithChildren<AppLayoutProps>) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    const [pageTitle, setPageTitle] = useState<string | null>(null);
    const [pageBackButtonLink, setPageBackButtonLink] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(matches);

    const ITEM_HEIGHT = 48;
    const {user} = useSelector((state: StateParams) => state.auth);
    const [profileMenu, setProfileMenu] = React.useState<null | HTMLElement>(null);
    const openProfileMenu = Boolean(profileMenu);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setProfileMenu(event.currentTarget);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(s => !s);
    };

    useEffect(() => {
        setIsDrawerOpen(matches);
    }, [matches]);

    useEffect(() => {
        const pageTitleSubscription = Communications.pageTitleSubject.subscribe((title) => {
            setPageTitle(title);
        });
        const pageBackButtonSubscription = Communications.pageBackButtonSubject.subscribe((buttonLink) => {
            setPageBackButtonLink(buttonLink || null);
        });
        return () => {
            pageTitleSubscription.unsubscribe();
            pageBackButtonSubscription.unsubscribe();
        }
    }, []);

    const classes = useStyles();
    const logout = useCallback(() => {
        dispatch(logoutUser());
    }, [dispatch]);

    const handleClose = useCallback(() => {
        setProfileMenu(null);
    }, [])

    return (<div className={classes.root + ' app-layout'}>
        <CssBaseline/>
        <AppBar position="fixed" color={"inherit"} variant={"elevation"} elevation={1} className={classes.appBar}>
            <Toolbar>
                <div className="brand">
                    <Link to={'/'}>
                        <img src={ImageConfig.Logo} alt={'vitawerks'}/>
                    </Link>
                    <IconButton onClick={toggleDrawer} edge="start" className={'menuButton'} color="inherit"
                                aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                </div>
                <div className="back-title-holder">
                    {pageBackButtonLink && <IconButton color={"secondary"} component={Link} to={pageBackButtonLink}>
                        <ArrowBackIosOutlinedIcon/>
                    </IconButton>}
                    {pageTitle && <div className="page-title-text">
                        &nbsp;{pageTitle}
                    </div>}
                </div>
                <div onClick={handleClick}
                     className={"cursor-pointer display-flex align-items-center"}
                >
                    <p className='account_name'>{user?.first_name}&nbsp;{user?.last_name}</p>&nbsp;&nbsp;
                    <Avatar src="/broken-image.jpg" className="profile_avatar"/>&nbsp;
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        className="pdd-5"
                    >
                        <ExpandMoreIcon id="down-arrow"/>
                    </IconButton>
                </div>
                <div className="">
                    <div className="profile_menu">
                        <Menu
                            id="long-menu"
                            anchorEl={profileMenu}
                            keepMounted
                            open={openProfileMenu}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '15ch',
                                    marginTop: "30px"
                                },
                            }}
                        >
                            <MenuItem onClick={logout} key={"logout"} id="logout-btn">
                                <img src={Logout} alt="logout"/> &nbsp;&nbsp;<p
                                className='mrg-top-0 mrg-bottom-0 logout'>Logout</p>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </Toolbar>
        </AppBar>
        
        <Drawer
            className={classes.drawer + (isDrawerOpen ? ' drawerOpened ' : ' drawerClosed ')}
            variant={"permanent"}
            classes={{
                paper: classes.drawerPaper,
            }}
            onClose={console.log} open={isDrawerOpen}
        >
            <Toolbar/>
            <div className={classes.drawerContainer}>
                <MenuItemsComponent/>
            </div>
        </Drawer>
        <main className={classes.content}>
            <Toolbar/>
            <div className="page-container">
                {props.children}
            </div>
        </main>
    </div>);
};

export default AppLayout;


