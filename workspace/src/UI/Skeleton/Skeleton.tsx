import Skeleton from "@mui/material/Skeleton";
import { Stack } from "@mui/material";

const SkeletonLog = () => {
  return (
    <Stack spacing={1}>
      <Skeleton variant="text" sx={{ fontSize: "20px" }} />
      <Skeleton variant="circular" width={"100%"} height={"100%"} />
      <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      <Skeleton variant="rounded" width={"100%"} height={"100%"} />
    </Stack>
  );
};

export default SkeletonLog;
