import pandas as pd
from matplotlib import pyplot as plt
import matplotlib
import plotly.express as px
import os
import threading

# create a lock object

lock = threading.Lock()
matplotlib.use('agg')


def setup_dir(dir):
    if not os.path.exists(dir):
        os.makedirs(dir)


class ThreeDimensionalGrapher:

    @staticmethod
    def draw_trace(actual_position_list, full_target_directory, drone_name, title):
        with lock:
            fig = plt.figure()
            ax = fig.add_subplot(111, projection='3d')
            x1 = [point[0] for point in actual_position_list]
            y1 = [point[1] for point in actual_position_list]
            z1 = [-point[2] for point in actual_position_list]
            ax.plot(x1, y1, z1, label="Position trace")
            # max_val = max(abs(max(x1, key=abs)), abs(max(y1, key=abs)), abs(max(z1, key=abs)))
            # ax.set_xlim([-max_val, max_val])
            # ax.set_ylim([-max_val, max_val])
            # ax.set_zlim([-max_val, max_val])
            ax.legend()
            ax.set_box_aspect([1, 1, 1])
            ax.set_xlabel('North (+X) axis')
            ax.set_ylabel('East (+Y) axis')
            ax.set_zlabel('Height (+Z) axis')
            setup_dir(full_target_directory)
            file_name = os.path.join(full_target_directory, str(drone_name) + "_plot.png")
            # print(file_name)
            plt.title(title)
            plt.savefig(file_name, dpi=200, bbox_inches='tight')
            plt.close()
            fig.clf()

    @staticmethod
    def draw_trace_vs_planned(planed_position_list, actual_position_list, full_target_directory, drone_name,
                              title):
        with lock:
            fig = plt.figure()
            ax = fig.add_subplot(111, projection='3d')
            x1 = [point[0] for point in planed_position_list]
            y1 = [point[1] for point in planed_position_list]
            z1 = [-point[2] for point in planed_position_list]
            ax.plot(x1, y1, z1, label="Planed")

            x2 = [point[0] for point in actual_position_list]
            y2 = [point[1] for point in actual_position_list]
            z2 = [-point[2] for point in actual_position_list]
            ax.plot(x2, y2, z2, label="Actual")
            # ax.set_box_aspect([1, 1, 1])
            # max_val = max(abs(max(x1, key=abs)), abs(max(y1, key=abs)), abs(max(z1, key=abs)))
            # max_val = max(max_val, max(abs(max(x2, key=abs)), abs(max(y2, key=abs)), abs(max(z2, key=abs))))
            ax.set_box_aspect([1, 1, 1])
            # ax.set_xlim([-max_val, max_val])
            # ax.set_ylim([-max_val, max_val])
            # ax.set_zlim([-max_val, max_val])
            ax.set_xlabel('North (+X) axis')
            ax.set_ylabel('East (+Y) axis')
            ax.set_zlabel('Height (+Z) axis')
            ax.legend()
            setup_dir(full_target_directory)
            file_name = os.path.join(full_target_directory, str(drone_name) + "_plot.png")
            # print(file_name)
            plt.title(title)
            plt.savefig(file_name, dpi=200, bbox_inches='tight')
            plt.close()
            fig.clf()

    @staticmethod
    def draw_trace_vs_point(destination_point, actual_position_list, full_target_directory, drone_name,
                            title):
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

            # point_max = max(destination_point, key=abs)
            # max_val = max(max(
            #     abs(max(x2, key=abs)), abs(max(y2, key=abs)), abs(max(z2, key=abs))))
            # max_val = max(max_val, point_max)
            #
            # ax.set_xlim([-max_val, max_val])
            # ax.set_ylim([-max_val, max_val])
            # ax.set_zlim([-max_val, max_val])
            ax.set_xlabel('North (+X) axis')
            ax.set_ylabel('East (+Y) axis')
            ax.set_zlabel('Height (+Z) axis')
            ax.set_box_aspect([1, 1, 1])
            ax.legend()
            setup_dir(full_target_directory)
            file_name = os.path.join(full_target_directory, str(drone_name) + "_plot.png")
            plt.title(title)
            plt.savefig(file_name, dpi=200, bbox_inches='tight')
            plt.close()
            fig.clf()

    @staticmethod
    def draw_interactive_trace(actual_position, full_target_directory, drone_name,
                               title):
        with lock:
            actual = actual_position
            fig = plt.figure()
            ax = fig.add_subplot(111, projection='3d')
            x1 = [point[0] for point in actual]
            y1 = [point[1] for point in actual]
            z1 = [-point[2] for point in actual]
            fig = px.scatter_3d(title=title)
            fig.add_scatter3d(x=x1, y=y1, z=z1, name=drone_name + " path")
            # max_val = max(abs(max(x1, key=abs)), abs(max(y1, key=abs)), abs(max(z1, key=abs)))
            # fig.update_layout(title_text=title,
            #                   scene=dict(xaxis_range=[-max_val, max_val],
            #                              yaxis_range=[-max_val, max_val],
            #                              zaxis_range=[-max_val, max_val]))
            setup_dir(full_target_directory)
            ax.set_xlabel('North (+X) axis')
            ax.set_ylabel('East (+Y) axis')
            ax.set_zlabel('Height (+Z) axis')
            file_name = os.path.join(full_target_directory, str(drone_name) + "_interactive.html")
            fig.write_html(file_name)
            plt.close()

    @staticmethod
    def draw_interactive_trace_vs_point(destination, actual_position, full_target_directory, drone_name,
                                        title):
        with lock:
            actual = actual_position
            fig = plt.figure()
            ax = fig.add_subplot(111, projection='3d')
            x1 = [point[0] for point in actual]
            y1 = [point[1] for point in actual]
            z1 = [-point[2] for point in actual]
            df = pd.DataFrame({'x': x1, 'y': y1, 'z': z1})
            fig = px.scatter_3d(df, x='x', y='y', z='z')
            ax.set_xlabel('North (+X) axis')
            ax.set_ylabel('East (+Y) axis')
            ax.set_zlabel('Height (+Z) axis')
            fig.add_scatter3d(x=[destination[0]], y=[destination[1]], z=[-destination[2]], name="Destination point",
                              marker=dict(size=10, symbol='circle'))
            # max_val = max(abs(max(destination, key=abs)))
            # max_val = max(max_val, max(abs(max(x1, key=abs)), abs(max(y1, key=abs)), abs(max(z1, key=abs))))
            # fig.update_layout(scene=dict(xaxis_range=[-max_val, max_val],
            #                              yaxis_range=[-max_val, max_val],
            #                              zaxis_range=[-max_val, max_val]))
            setup_dir(full_target_directory)
            file_name = os.path.join(full_target_directory, str(drone_name) + "_interactive.html")
            fig.write_html(file_name)
            plt.close()

    @staticmethod
    def draw_interactive_trace_vs_planned(planed_position_list, actual_position_list, full_target_directory,
                                          drone_name,
                                          title):
        with lock:
            fig = plt.figure()
            ax = fig.add_subplot(111, projection='3d')
            x1 = [point[0] for point in actual_position_list]
            y1 = [point[1] for point in actual_position_list]
            z1 = [-point[2] for point in actual_position_list]
            x2 = [point[0] for point in planed_position_list]
            y2 = [point[1] for point in planed_position_list]
            z2 = [-point[2] for point in planed_position_list]
            ax.set_xlabel('North (+X) axis')
            ax.set_ylabel('East (+Y) axis')
            ax.set_zlabel('Height (+Z) axis')

            fig = px.scatter_3d(title=title)
            fig.add_scatter3d(x=x1, y=y1, z=z1, name="Actual")
            fig.add_scatter3d(x=x2, y=y2, z=z2, name="Planned")
            # max_val = max(abs(max(x1, key=abs)), abs(max(y1, key=abs)), abs(max(z1, key=abs)))
            # max_val = max(max_val, max(abs(max(x2, key=abs)), abs(max(y2, key=abs)), abs(max(z2, key=abs))))
            # fig.update_layout(title_text=title,
            #                   scene=dict(xaxis_range=[-max_val, max_val],
            #                              yaxis_range=[-max_val, max_val],
            #                              zaxis_range=[-max_val, max_val]))
            html_content = fig.to_html(full_html=True)

            return html_content
