/**
 * Ship -   Player ship
 */

class Ship extends BaseObject
{
    constructor()
    {
        super();
        
        this.position = new Vector2(GAZCanvas.referenceScreenSize.w / 2, GAZCanvas.referenceScreenSize.h / 2);
        this.velocity = new Vector2(0, 0);
        this.angle = 0;

        this.invincibleTicker = 0;
        this.displayThrust = false;

        this.transform = new Matrix();
        
        //define the ship model as an array of points
        this.shipModel = [new Vector2(0, 20)
            , new Vector2(10, -10)
            , new Vector2(0, -5)
            , new Vector2(-10, -10)];
    }
    
    init()
    {
        super.init();
    
        this.position = new Vector2(GAZCanvas.referenceScreenSize.w / 2, GAZCanvas.referenceScreenSize.h / 2);
        this.velocity = new Vector2(0, 0);
        this.angle = 0;

        this.invincibleTicker = 0;
        this.displayThrust = false;

    }
    
    update()
    {
        // Control the rotation of the ship with the mouse
        if (Input.mouseLogicalPos !== undefined)
        {
            let Angle_in_radians = Math.atan2(this.position.y - Input.mouseLogicalPos.y
                , this.position.x - Input.mouseLogicalPos.x) + Math.PI / 2;

            // Make sure you cannot rotate the ship more than a semi circle
            if (Angle_in_radians <= 1.5)
            {
                this.angle = Angle_in_radians;
            }
        }
        
        let thrust = new Vector2(0, 0);
        let thrusting = false;
        
        
        if (Input.getKeystate(KEYCODE_up_arrow) != 'not_pressed')
        {
            thrusting = true;
        }
        else
        {
            thrusting = false;
        }

        /*
            The ship has a thruster that will flicker on and off while the ship is thrusting. This is done with the
            framecount%5. Doing the === 1 will only turn the thrust on 1/5th of the time
         */
        this.displayThrust = ((thrusting === true) && (AstGameInst.frameCount % 5) === 1);
        
        if (this.isInvincible() === true)
        {
            this.invincibleTicker--;
        }
    
        this.transform = Matrix.Multiply(Matrix.CreateRotationZ(this.angle), Matrix.CreateTranslation(this.position.x, this.position.y, 0));
        
        super.update();
    }
    
    isInvincible()
    {
        return this.invincibleTicker > 0;
    }
    
    draw()
    {
        let drawShip = true;
        
        if (this.invincibleTicker > 0)
        {
            //framecount %30 > 15 will draw the ship for half the time
            drawShip = (AstGameInst.frameCount % 30) > 15;
        }
        
        if (drawShip == true)
        {
            //draw the ship, this works in the same way as the rocks
            let points = this.getLineList();
            let i;
            
            for (i = 0; i < points.length; i+=2)
            {
                GAZCanvas.Line(points[i], points[(i + 1)], '#000000',3);
            }
            
            if (this.displayThrust == true)
            {
                //thrust 'diamond' out of the back of the ship
                let thrustLines = [new Vector2(0, -7)
                    , new Vector2(5, -11)
                    , new Vector2(0, -20)
                    , new Vector2(-5, -11)];
                
                
                for (i = 0; i < 4; i++)
                {
                    thrustLines[i] = this.transform.TransformVector2(thrustLines[i]);
                }
                
                let index = [0, 1, 1, 2, 2, 3, 3, 0];
                
                for (i = 0; i < index.length; i += 2)
                {
                    GAZCanvas.Line(thrustLines[index[i]], thrustLines[index[i + 1]], '#000000', 3);
                }
            }
        }
        super.draw();
    }
    
    setInvincible()
    {
        this.invincibleTicker = 180;
    }
    
    getLineList()
    {
        let points = [];
        let i;
    
        for (i = 0; i < this.shipModel.length; i++)
        {
            points.push(this.transform.TransformVector2(this.shipModel[i]));
            points.push(this.transform.TransformVector2(this.shipModel[(i+1)%this.shipModel.length]));
        }
        
        return points;
    }
}