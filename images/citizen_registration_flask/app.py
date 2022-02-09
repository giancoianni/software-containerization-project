import flask
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
POSTGRES_USER = 'postgres'
POSTGRES_PASSWORD = 'postgres'
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@postgres:5432/postgres'
# engine:[//[user[:password]@][host]/[dbname]]
# engine -> postgresql
# user -> postgres
# password -> postgres
# host -> localhost (running locally on our machine)
# dbname -> postgres (name given to the db)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = 'secret string'

db = SQLAlchemy(app)
db.init_app(app)


def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


# probable help links: https://www.digitalocean.com/community/tutorials/how-to-use-a-postgresql-database-in-a-flask-application
# https://javascript.tutorialink.com/cant-return-multiple-variables-from-flask-to-javascript-ajax-function/

class PersonModel(db.Model):
    __tablename__ = 'details'

    id = db.Column(db.Integer, primary_key=True)
    email_address = db.Column(db.String())
    password = db.Column(db.String())
    name = db.Column(db.String())
    dob = db.Column(db.Date())
    address = db.Column(db.String())
    mobile = db.Column(db.String())

    def __init__(self, email_address, password, name, dob, address, mobile):
        self.email_address = email_address
        self.password = password
        self.name = name
        self.dob = dob
        self.address = address
        self.mobile = mobile

    def __repr__(self):
        return f"<Email-address = {self.email_address}>"

db.create_all()

@app.route("/", methods=['GET'])
@cross_origin()
def hello_world():
    return "Hello World!"


@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    data = request.get_json(force=True)
    email_address = data['email']
    password = data['password']
    app.logger.info("Landed into login API!")
    if (email_address and password) or (not email_address and password) or (email_address and not password):
        app.logger.info("Values for email address %s and password %s is passed here" % (email_address, password))
        existing_email_user = PersonModel.query.filter(
            PersonModel.email_address == email_address
        ).first()
        if existing_email_user:
            existing_email_user = PersonModel.query.filter(
                PersonModel.email_address == email_address, PersonModel.password == password
            ).first()
            if existing_email_user:
                app.logger.info("User %s logged in successfully", email_address)
                return_data = [{"email": email_address, "name": existing_email_user.name,
                                "dob": existing_email_user.dob, "address": existing_email_user.address,
                                "mobile": existing_email_user.mobile}]
                return return_response(return_data, 200)
            else:
                app.logger.info("User has entered incorrect password! Please try again using correct password.")
                return_data = [{"email": email_address, "name": "",
                                "dob": "", "address": "",
                                "mobile": ""}]
                return return_response(return_data, 202)
        else:
            return_data = [{"email": email_address, "name": "",
                            "dob": "", "address": "",
                            "mobile": ""}]
            app.logger.info("User having email-address %s is not registered/found!" % email_address)
            return return_response(return_data, 201)
    else:
        return_data = [{"email": email_address, "name": "",
                        "dob": "", "address": "",
                        "mobile": ""}]
        app.logger.info("The user has not provided sufficient credentials: email - %s and password - %s!" % (email_address, password))
        return return_response(return_data, 203)


def return_response(return_data, status):
    response = flask.make_response(jsonify(return_data))
    response.headers['Access-Control-Allow-Headers'] = '*'
    # response.headers['Access-Control-Allow-Origin'] = '*'
    response.status_code = status
    return response


@app.route('/register', methods=['POST'])
@cross_origin()
def register():
    data = request.get_json()
    email_address = data['email']
    password = data['password']
    name = data['name']
    dob = data['dob']
    address = data['address']
    mobile = data['mobile']
    if email_address and password:
        existing_email_user = PersonModel.query.filter(
            PersonModel.email_address == email_address and PersonModel.password == password
        ).first()
        if existing_email_user:
            app.logger.info("User %s is already registered", email_address)
            return_data = [{
                "email": existing_email_user.email_address, "password": existing_email_user.password,
                "name": existing_email_user.name, "dob": existing_email_user.dob,
                "address": existing_email_user.address, "mobile": existing_email_user.mobile
            }]
            return return_response(return_data, 202)
        else:
            entry = PersonModel(email_address, password, name, dob, address, mobile)
            db.session.add(entry)
            db.session.commit()
            return_data = [{"email": email_address, "password": password,
                            "name": name, "dob": dob,
                            "address": address, "mobile": mobile}]
            app.logger.info(
                "Values for email address %s and password %s committed in the database!" % (email_address, password))
    else:
        return_data = [{"email": email_address, "name": "",
                        "dob": "", "address": "",
                        "mobile": ""}]
        app.logger.info("Values for email address %s and password %s is not available!" % (email_address, password))
        # return return_response(return_data)
    return return_response(return_data, 200)


@app.route('/details/<string:email>', methods=['GET'])
@cross_origin()
def handle_registration(email):
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            new_citizen = PersonModel(email_address=data['email'],
                                      password=data['password'],
                                      name=data['name'],
                                      dob=data['dob'],
                                      address=data['address'],
                                      mobile=data['mobile']
                                      )
            db.session.add(new_citizen)
            db.session.commit()
            return_data = [{"email": data['email'], "password": data['password'],
                            "name": data['name'], "dob": data['dob'],
                            "address": data['address'], "mobile": data['mobile']}]
            return return_response(return_data)
        else:
            return return_response({"error": "The request payload is not in JSON format"})
    # https://stackabuse.com/using-sqlalchemy-with-flask-and-postgresql/
    elif request.method == 'GET':
        persons = PersonModel.query.filter(PersonModel.email_address.like(email))
        results = [
            {
                "email": person.email_address, "password": person.password,
                "name": person.name, "dob": person.dob,
                "address": person.address, "mobile": person.mobile
            } for person in persons]

        return return_response(results, 200)


if __name__ == '__main__':
    app.run(debug=True)
