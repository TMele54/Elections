from flask import Flask, render_template

app = Flask(__name__)


@app.route('/map')
def map():
    return render_template('map.html')

@app.route('/scatter')
def scatter():
    return render_template('scatter.html')

@app.route('/ele')
def ele():
    return render_template('elections.html')


if __name__ == '__main__':
    app.run(debug=True, port=3000)
