"use client"

import React, { useState } from "react"

import { UserData } from "@/lib/prisma/types"

import { Button } from "../ui/button"
import EditProfileDialog from "./edit-profile-dialog"

type Props = {
  user: UserData
}

const EditProfileButton = ({ user }: Props) => {
  const [showDialog, setShowDialog] = useState(false)
  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        Edit profile
      </Button>
      <EditProfileDialog user={user} onOpenChange={setShowDialog} open={showDialog} />
    </>
  )
}

export default EditProfileButton
