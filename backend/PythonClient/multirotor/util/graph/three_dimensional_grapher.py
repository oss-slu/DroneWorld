import pandas as pd
from matplotlib import pyplot as plt
import matplotlib
import plotly.express as px
import threading
import io  # For in-memory buffer

# Create a lock object
lock = threading.Lock()
matplotlib.use('agg')  # Use non-interactive backend


class ThreeDimensionalGrapher:
    def __init__(self, storage_service):
        self.storage_service = storage_service

    def draw_trace(self, actual_position_list, drone_name, title, folder_path):
        with lock:
            fig = plt.figure()
            ax = fig.add_subplot(111, projection='3d')
            x1 = [point[0] for point in actual_position_list]
            y1 = [point[1] for point in actual_position_list]
            z1 = [-point[2] for point in actual_position_list]
            ax.plot(x1, y1, z1, label="Position trace")
            ax.legend()
            ax.set_box_aspect([1, 1, 1])
            ax.set_xlabel('North (+X) axis')
            ax.set_ylabel('East (+Y) axis')
            ax.set_zlabel('Height (+Z) axis')
            plt.title(title)
            # Save to in-memory buffer
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=200, bbox_inches='tight')
            buf.seek(0)
            content = buf.read()
            buf.close()
            plt.close()
            fig.clf()
            # Upload to storage service
            file_name = f"{folder_path}{drone_name}_plot.png"
            self.storage_service.upload_to_service(file_name, content, content_type='image/png')

    def draw_trace_vs_planned(self, planed_position_list, actual_position_list, drone_name, title, folder_path):
        with lock:
            fig = plt.figure()
            ax = fig.add_subplot(111, projection='3d')
            x1 = [point[0] for point in planed_position_list]
            y1 = [point[1] for point in planed_position_list]
            z1 = [-point[2] for point in planed_position_list]
            ax.plot(x1, y1, z1, label="Planned")
            x2 = [point[0] for point in actual_position_list]
            y2 = [point[1] for point in actual_position_list]
            z2 = [-point[2] for point in actual_position_list]
            ax.plot(x2, y2, z2, label="Actual")
            ax.set_box_aspect([1, 1, 1])
            ax.set_xlabel('North (+X) axis')
            ax.set_ylabel('East (+Y) axis')
            ax.set_zlabel('Height (+Z) axis')
            ax.legend()
            plt.title(title)
            # Save to in-memory buffer
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=200, bbox_inches='tight')
            buf.seek(0)
            content = buf.read()
            buf.close()
            plt.close()
            fig.clf()
            # Upload to storage service
            file_name = f"{folder_path}{drone_name}_plot.png"
            self.storage_service.upload_to_service(file_name, content, content_type='image/png')

    def draw_trace_vs_point(self, destination_point, actual_position_list, drone_name, title, folder_path):
        with lock:
            fig = plt.figure()
            ax = fig.add_subplot(111, projection='3d')
            x1 = destination_point[0]
            y1 = destination_point[1]
            z1 = -destination_point[2]
            ax.plot(x1, y1, z1, marker="o", markersize=10, label="Destination")
            x2 = [point[0] for point in actual_position_list]
            y2 = [point[1] for point in actual_position_list]
            z2 = [-point[2] for point in actual_position_list]
            ax.plot(x2, y2, z2, label="Actual")
            ax.set_xlabel('North (+X) axis')
            ax.set_ylabel('East (+Y) axis')
            ax.set_zlabel('Height (+Z) axis')
            ax.set_box_aspect([1, 1, 1])
            ax.legend()
            plt.title(title)
            # Save to in-memory buffer
            buf = io.BytesIO()
            plt.savefig(buf, format='png', dpi=200, bbox_inches='tight')
            buf.seek(0)
            content = buf.read()
            buf.close()
            plt.close()
            fig.clf()
            # Upload to storage service
            file_name = f"{folder_path}{drone_name}_plot.png"
            self.storage_service.upload_to_service(file_name, content, content_type='image/png')

    def draw_interactive_trace(self, actual_position, drone_name, title, folder_path):
        with lock:
            x1 = [point[0] for point in actual_position]
            y1 = [point[1] for point in actual_position]
            z1 = [-point[2] for point in actual_position]
            fig = px.scatter_3d(title=title)
            fig.add_scatter3d(x=x1, y=y1, z=z1, name=drone_name + " path")
            fig.update_layout(
                scene=dict(
                    xaxis_title='North (+X) axis',
                    yaxis_title='East (+Y) axis',
                    zaxis_title='Height (+Z) axis',
                    aspectratio=dict(x=1, y=1, z=1)
                )
            )
            # Save to HTML in-memory buffer
            html_str = fig.to_html()
            content = html_str.encode('utf-8')
            # Upload to storage service
            file_name = f"{folder_path}{drone_name}_interactive.html"
            self.storage_service.upload_to_service(file_name, content, content_type='text/html')

    def draw_interactive_trace_vs_point(self, destination, actual_position, drone_name, title, folder_path):
        with lock:
            x1 = [point[0] for point in actual_position]
            y1 = [point[1] for point in actual_position]
            z1 = [-point[2] for point in actual_position]
            fig = px.scatter_3d(x=x1, y=y1, z=z1, title=title)
            fig.add_scatter3d(
                x=[destination[0]],
                y=[destination[1]],
                z=[-destination[2]],
                name="Destination point",
                marker=dict(size=10, symbol='circle')
            )
            fig.update_layout(
                scene=dict(
                    xaxis_title='North (+X) axis',
                    yaxis_title='East (+Y) axis',
                    zaxis_title='Height (+Z) axis',
                    aspectratio=dict(x=1, y=1, z=1)
                )
            )
            # Save to HTML in-memory buffer
            html_str = fig.to_html()
            content = html_str.encode('utf-8')
            # Upload to storage service
            file_name = f"{folder_path}{drone_name}_interactive.html"
            self.storage_service.upload_to_service(file_name, content, content_type='text/html')

    def draw_interactive_trace_vs_planned(self, planed_position_list, actual_position_list, drone_name, title, folder_path):
        with lock:
            x1 = [point[0] for point in actual_position_list]
            y1 = [point[1] for point in actual_position_list]
            z1 = [-point[2] for point in actual_position_list]
            x2 = [point[0] for point in planed_position_list]
            y2 = [point[1] for point in planed_position_list]
            z2 = [-point[2] for point in planed_position_list]
            fig = px.scatter_3d(title=title)
            fig.add_scatter3d(x=x1, y=y1, z=z1, name="Actual")
            fig.add_scatter3d(x=x2, y=y2, z=z2, name="Planned")
            fig.update_layout(
                scene=dict(
                    xaxis_title='North (+X) axis',
                    yaxis_title='East (+Y) axis',
                    zaxis_title='Height (+Z) axis',
                    aspectratio=dict(x=1, y=1, z=1)
                )
            )
            # Save to HTML in-memory buffer
            html_str = fig.to_html()
            content = html_str.encode('utf-8')
            # Upload to storage service
            file_name = f"{folder_path}{drone_name}_interactive.html"
            self.storage_service.upload_to_service(file_name, content, content_type='text/html')
