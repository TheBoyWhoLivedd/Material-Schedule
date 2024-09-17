import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetUsersQuery } from './usersApiSlice'
import { memo } from 'react'
import { TableRow, TableCell, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

const User = ({ userId }) => {

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        }),
    })

    const navigate = useNavigate()

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`)

        const userRolesString = user.roles.toString().replaceAll(',', ', ')

        return (
            <TableRow>
                <TableCell>{user.username}</TableCell>
                <TableCell>{userRolesString}</TableCell>
                <TableCell>
                    <IconButton
                        onClick={handleEdit}
                        size="small"
                    >
                        <EditIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        )

    } else return null
}

const memoizedUser = memo(User)

export default memoizedUser