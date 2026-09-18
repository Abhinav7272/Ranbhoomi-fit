import { listImages, postImage, patchImage, deleteImage } from "@/lib/image-collection";

export async function GET() {
  return listImages("gallery");
}

export async function POST(req: Request) {
  return postImage("gallery", req);
}

export async function PATCH(req: Request) {
  return patchImage("gallery", req);
}

export async function DELETE(req: Request) {
  return deleteImage("gallery", req);
}
