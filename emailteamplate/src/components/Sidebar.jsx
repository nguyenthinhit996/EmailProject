import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Avatar, Button, Typography, Badge } from '@mui/material';
import { Inbox, Drafts, Send, Report, Delete, Work, TravelExplore, Group, Label } from '@mui/icons-material';
import './Sidebar.css';
import profileImage from '../assets/elena-rollins.jpg';

const Sidebar = () => {
    return (
        <Box className="sidebar" sx={{ width: "350px" }}>
            <Box sx={{ margin: "10px 20px" }}>
                <Box className="profile" sx={{ textAlign: 'center', p: 2, backgroundColor: "#00BFFF", borderRadius: "31px" }}>
                    <Avatar src={profileImage} sx={{ width: 70, height: 70, mx: 'auto' }} />
                    <Typography variant="h6" sx={{ mt: 1 }}>Elena Rollins</Typography>
                    <Typography variant="body1" color="textSecondary">Administrator</Typography>
                </Box>
                <Button variant="contained" color="primary" fullWidth sx={{ my: 2 }}>
                    + Compose
                </Button>
                <List>
                    <ListItem button>
                        <ListItemIcon>
                            <Inbox color='info' />
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                        <Badge badgeContent={3} color="primary" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Drafts color='info' />
                        </ListItemIcon>
                        <ListItemText primary="Drafts" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Send color='info' />
                        </ListItemIcon>
                        <ListItemText primary="Sent" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Report color='info' />
                        </ListItemIcon>
                        <ListItemText primary="Spam" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Delete color='info' />
                        </ListItemIcon>
                        <ListItemText primary="Deleted" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Work color='info' />
                        </ListItemIcon>
                        <ListItemText primary="Work" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <TravelExplore color='info' />
                        </ListItemIcon>
                        <ListItemText primary="Travelling" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Group color='info' />
                        </ListItemIcon>
                        <ListItemText primary="Friends" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <Label color='info' />
                        </ListItemIcon>
                        <ListItemText primary="New tag" />
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};

export default Sidebar;
