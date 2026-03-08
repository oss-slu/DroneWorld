import os

from PythonClient import airsim


def _get_rpc_host():
    return os.getenv("DRV_UNREAL_HOST", "127.0.0.1")


def _get_rpc_port():
    raw_port = (
        os.getenv("DRV_UNREAL_RPC_PORT")
        or os.getenv("DRV_UNREAL_API_PORT")
        or "41451"
    )
    try:
        return int(raw_port)
    except (TypeError, ValueError):
        print(
            f"[WARN] Invalid DRV_UNREAL_RPC_PORT/DRV_UNREAL_API_PORT value '{raw_port}', falling back to 41451"
        )
        return 41451


def get_rpc_target():
    return _get_rpc_host(), _get_rpc_port()


def create_multirotor_client(timeout_value=3600):
    host, port = get_rpc_target()
    print(f"[AirSim RPC target] host={host} port={port}")
    return airsim.MultirotorClient(ip=host, port=port, timeout_value=timeout_value)
