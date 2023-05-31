<?php

error_reporting(E_ALL);
ini_set('display_error', 1);

Class User {
    // guestUser Properties
    public $id;
    public $idNo;
    public $contactNumber;
    public $organization;
    public $address;
    public $userType;
    public $name;
    public $department;
    public $domainEmail;
    public $password;


    // Database Data.

    private $connection;
    private $table = 'guestUser';

    public function __construct ($db)
    {
        $this->connection = $db;

        // Check if table exists, and create it if it doesn't.
        $query = "CREATE TABLE IF NOT EXISTS $this->table (
                    id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    contact INT(16) NOT NULL,
                    department VARCHAR(255),
                    idNo VARCHAR(255),
                    organization VARCHAR(255),
                    address VARCHAR(255),
                    usertype VARCHAR(20) NOT NULL,
                    domainEmail VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL
                )";
        $this->connection->exec($query);
    }

    // Method to read all the saved guestUser from database.
    public function readguestUser()
    {
        // Query for reading posts from table.

        $query = 'SELECT
            guestUser.id,
            guestUser.name,
            guestUser.contact,
            guestUser.department,
            guestUser.idNo,
            guestUser.organization,
            guestUser.address,
            guestUser.usertype,
            guestUser.domainEmail,
            guestUser.password
            FROM '.$this->table.'
            ORDER BY
            guestUser.id ASC
        ';
        $user = $this->connection->prepare($query);

        $user->execute();

        return $user;
    }

    public function read_single_user($id) {
        
        
        $this->id = $id;

        $query = 'SELECT
            guestUser.id,
            guestUser.name,
            guestUser.contact,
            guestUser.department,
            guestUser.idNo,
            guestUser.organization,
            guestUser.address,
            guestUser.usertype,
            guestUser.domainEmail,
            guestUser.password
            FROM '.$this->table.'
            WHERE guestUser.id=?
            LIMIT 0,1
        ';

        $user = $this->connection->prepare($query);

        //$user->bindValue('id', $this->id, PDO::PARAM_INT);

        $user->execute([$this->id]);
        return $user;
    }
    

    // Method to login guestUser

    public function login_user($domainEmail, $password) 
    {
        try 
        {
            // Query to check if user with the provided email and password exists.
            $query = "SELECT * FROM $this->table WHERE domainEmail = :domainEmail AND password = :password";
            $user = $this->connection->prepare($query);
            $user->bindValue('domainEmail', $domainEmail);
            $user->bindValue('password', $password);
            $user->execute();

            return $user;
        } 
        catch(PDOException $e) 
        {
            echo $e->getMessage();
        }
    }



    // Method to create new records.

    public function create_new_user ($params)
    {
        try
        {
            // Assigning value.
            $this->name = $params['name'];
            $this->idNo = $params['idNo'];
            $this->contactNumber = $params['contactNumber'];
            $this->organization = $params['organization'];
            $this->address = $params['address'];
            $this->userType = $params['userType'];
            $this->department = $params['department'];
            $this->domainEmail = $params['domainEmail'];
            $this->password = $params['password'];

            // Query to store new post in database.

            $query = "INSERT INTO $this->table 
                    SET
                        name = :name,
                        idNo = :idNo,
                        organization = :organization,
                        contact = :contact,
                        address = :address,
                        usertype = :usertype,
                        department = :department,
                        domainEmail = :domainEmail,
                        password = :password";
            
            $user = $this->connection->prepare($query);

            $user->bindValue('name', $this->name);
            $user->bindValue('idNo', $this->idNo);
            $user->bindValue('organization', $this->organization);
            $user->bindValue('contact', $this->contactNumber);
            $user->bindValue('usertype', $this->userType);
            $user->bindValue('address', $this->address);
            $user->bindValue('department', $this->department);
            $user->bindValue('domainEmail', $this->domainEmail);
            $user->bindValue('password', $this->password);

            if ($user->execute())
            {
                return true;
            }

            return false;

        }
        catch (PDOException $e)
        {
            echo $e->getMessage();
        }
    }

    // Method for updating posts.

    public function update ($params)
    {
        try
        {
            // Assigning value.
            $this->name = $params['name'];
            $this->idNo = $params['idNo'];
            $this->contactNumber = $params['contactNumber'];
            $this->organization = $params['organization'];
            $this->address = $params['address'];
            $this->userType = $params['userType'];
            $this->department = $params['department'];
            $this->domainEmail = $params['domainEmail'];
            $this->password = $params['password'];

            // Query for updating existing record.

            $query = "UPDATE $this->table
                    SET
                        name = :name,
                        idNo = :idNo,
                        organization = :organization,
                        contact = :contact,
                        address = :address,
                        usertype = :usertype,
                        department = :department,
                        domainEmail = :domainEmail,
                        password = :password
                        WHERE id = :id";
            
            $user = $this->connection->prepare($query);
            
            $user->bindValue('name', $this->name);
            $user->bindValue('idNo', $this->idNo);
            $user->bindValue('organization', $this->organization);
            $user->bindValue('contact', $this->contactNumber);
            $user->bindValue('usertype', $this->userType);
            $user->bindValue('address', $this->address);
            $user->bindValue('department', $this->department);
            $user->bindValue('domainEmail', $this->domainEmail);
            $user->bindValue('password', $this->password);

            if ($user->execute())
            {
                return true;
            }

            return false;
        }
        catch(PDOException $e)
        {
            echo $e->getMessage();
        }
    }

    public function destroy_user ($id)
    {
        try
        {
            // Assigning values.

            $this->id = $id;
            
            // Query for deleting existing record.

            $query = "DELETE FROM $this->table WHERE id = :id";

            $user = $this->connection->prepare($query);

            $user->bindValue('id', $this->id);

            if($user->execute())
            {
                return true;
            }

            return false;
        }
        catch(PDOException $e)
        {
            echo $e->getMessage();
        }
    }

}