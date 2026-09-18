import { listImages, postImage, patchImage, deleteImage } from "@/lib/image-collection";

export async function GET() {
  return listImages("highlights");
}

export async function POST(req: Request) {
  return postImage("highlights", req);
}

export async function PATCH(req: Request) {
  return patchImage("highlights", req);
}

export async function DELETE(req: Request) {
  return deleteImage("highlights", req);
}
