# Instagram-Clone
A Simple yet Complete Instagram Clone built with Flask and React.  

<img src="https://i.ibb.co/zS6czd5/1.png" width="500" alt="Finished version"/>

<img src="https://i.ibb.co/sWfJxmX/2.png"  width="500" alt="Finished version"/>

To run this project, you would need:
* python3
* node js and npm
* bash or any other CLI

To make this work locally:

1. Click on `Code` > `Download Zip` and Extract it
2. Navigate to the root folder (directly inside **Instagram-Clone-master**) and open it in Visual Studio Code (or any other modern text editor)
3. Open terminal in visual studio code (**Ctrl+Shift+\`**)
4. Make a venv (virtual environment) using:  `python3 -m venv venv`
5. `source venv/bin/activate`
6. `pip install -r requirements.txt`
7. `export FLASK_APP=manage.py`
8. `flask db init`
9. `flask db migrate`
10. `flask db upgrade`
11. Finally, run the local server using: `python manage.py`
12. Then visit http://localhost:5000/ in a browser
