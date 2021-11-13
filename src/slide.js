
class Slider{
    active = 0
    
    constructor(slides, actions){
        this.slides = slides
        this.actions = actions
        this.actions[0][0].play()
    }
    next(){
        // if(this.slides.length=1){
        //     this.nextone()
        //     return
        // }
        if(this.active<this.slides.length-1){
            this.active++

            console.log("next",this.active)
            this.play(this.active-1, 1)
            this.play(this.active, 0)
        }
    }
    previous(){
        // if(this.slides.length=1){
        //     this.prevone()
        //     return
        // }
        if(this.active>0){
            this.active--
            this.play(this.active+1, 0, true)
            this.play(this.active, 1, true)


        }
    }
    nextone(){
        this.play(this.active, 0)
    }
    prevone(){
        this.play(this.active, 1)
    }
    play(obj, anim, reverse = false){
        this.actions[obj][anim].enabled = true
        this.actions[obj][1-anim].enabled = false
        this.actions[obj][anim].time = reverse ? 1 :0
        this.actions[obj][anim].paused = false
        this.actions[obj][anim].timeScale = reverse ? -1 : 1
        this.actions[obj][anim].play()
    }
}
export {Slider};