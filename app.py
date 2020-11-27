from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('map.html')

@app.route('/scatter')
def scatter():
    return render_template('scatter.html')


if __name__ == '__main__':
    app.run(debug=True, port=3000)
