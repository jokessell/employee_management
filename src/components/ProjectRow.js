// src/components/ProjectRow.js

import React, { useState } from 'react';
import {
    TableCell,
    TableRow,
    Button,
    Tooltip,
    Chip,
    Stack,
} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import BuildIcon from '@mui/icons-material/Build';

function ProjectRow({ project, handleEdit, handleDelete, classes, authRoles }) {
    const [hoveredEmployeeId, setHoveredEmployeeId] = useState(null);
    const [hoveredSkillId, setHoveredSkillId] = useState(null);

    // Check if the user has permission to edit/delete
    const canEdit = authRoles.includes('ELEVATED') || authRoles.includes('ADMIN');

    // Event handlers for employee chips
    const handleEmployeeMouseEnter = (employeeId) => {
        setHoveredEmployeeId(employeeId);
    };

    const handleEmployeeMouseLeave = () => {
        setHoveredEmployeeId(null);
    };

    // Event handlers for skill chips
    const handleSkillMouseEnter = (skillId) => {
        setHoveredSkillId(skillId);
    };

    const handleSkillMouseLeave = () => {
        setHoveredSkillId(null);
    };

    // Helper function to check if an employee has a specific skill
    const doesEmployeeHaveSkill = (employee, skillId) => {
        return employee.skills && employee.skills.some((skill) => skill.skillId === skillId);
    };

    return (
        <TableRow key={project.projectId} className={classes.tableRow}>
            <TableCell className={classes.tableCell}>{project.projectId}</TableCell>
            <TableCell className={classes.tableCell}>{project.projectName}</TableCell>
            <TableCell className={classes.tableCell}>{project.description}</TableCell>

            {/* Assigned Employees Column */}
            <TableCell className={`${classes.tableCell} ${classes.projectsColumn}`}>
                {project.employees && project.employees.length > 0 ? (
                    <Stack
                        direction="row"
                        spacing={0.5}
                        flexWrap="wrap"
                        alignItems="flex-start"
                        sx={{ rowGap: '5px' }}
                    >
                        {project.employees.map((emp) => (
                            <Chip
                                key={emp.employeeId}
                                label={emp.name}
                                variant="outlined"
                                size="small"
                                className={classes.chip}
                                icon={<FaceIcon style={{ fontSize: '1rem' }} />}
                                onMouseEnter={() => handleEmployeeMouseEnter(emp.employeeId)}
                                onMouseLeave={handleEmployeeMouseLeave}
                                style={
                                    hoveredEmployeeId === emp.employeeId ||
                                    (hoveredSkillId &&
                                        doesEmployeeHaveSkill(emp, hoveredSkillId))
                                        ? { backgroundColor: '#1976d2', color: '#fff' }
                                        : {}
                                }
                            />
                        ))}
                    </Stack>
                ) : (
                    'None'
                )}
            </TableCell>

            {/* Required Skills Column */}
            <TableCell className={`${classes.tableCell} ${classes.skillsColumn}`}>
                {project.skills && project.skills.length > 0 ? (
                    <Stack
                        direction="row"
                        spacing={0.5}
                        flexWrap="wrap"
                        alignItems="flex-start"
                        sx={{ rowGap: '5px' }}
                    >
                        {project.skills.map((skill) => (
                            <Chip
                                key={skill.skillId}
                                label={skill.name}
                                variant="outlined"
                                size="small"
                                className={classes.chip}
                                icon={<BuildIcon style={{ fontSize: '1rem' }} />}
                                onMouseEnter={() => handleSkillMouseEnter(skill.skillId)}
                                onMouseLeave={handleSkillMouseLeave}
                                style={
                                    hoveredSkillId === skill.skillId ||
                                    (hoveredEmployeeId &&
                                        doesEmployeeHaveSkill(
                                            project.employees.find((emp) => emp.employeeId === hoveredEmployeeId),
                                            skill.skillId
                                        ))
                                        ? { backgroundColor: '#1976d2', color: '#fff' }
                                        : {}
                                }
                            />
                        ))}
                    </Stack>
                ) : (
                    'None'
                )}
            </TableCell>

            {/* Actions Column */}
            <TableCell align="right" className={classes.tableCell}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Tooltip title="Edit Project">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEdit(project)}
                            size="small"
                            style={{ marginRight: '8px' }}
                            disabled={!canEdit}
                        >
                            Edit
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete Project">
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDelete(project)}
                            size="small"
                            disabled={!canEdit}
                        >
                            Delete
                        </Button>
                    </Tooltip>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default ProjectRow;
