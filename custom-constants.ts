'use client'
import { TiDocumentText } from "react-icons/ti";
import { DataType } from "./custom-types";
import { CgKey } from "react-icons/cg";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import { TbHexagon3D } from "react-icons/tb";
import { MdKey } from "react-icons/md";

export const typesStyles: { [key: string]: DataType } = {
    "text": { style: '#c67a1c', Icon: TiDocumentText },
    "key": { style: '#ffd438', Icon: MdKey },
    "photo": { style: '#19a15f', Icon: MdPhotoSizeSelectActual },
    "fbx": { style: '#0077ff', Icon: TbHexagon3D },
}

